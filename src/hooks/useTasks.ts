'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { tasksApi } from '@/services/api';
import type { Task, TaskFormData } from '@/types';

interface UseTasksOptions {
  date?: Date;
  autoFetch?: boolean;
}

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskFormData) => Promise<Task | null>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task | null>;
  toggleComplete: (id: string, isCompleted: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const { date, autoFetch = true } = options;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid stale closures in callbacks
  const dateRef = useRef(date);
  const tasksRef = useRef(tasks);
  
  // Update refs when values change
  useEffect(() => {
    dateRef.current = date;
  }, [date]);
  
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);
  
  // Memoize date string to prevent unnecessary re-fetches
  const dateString = useMemo(() => {
    return date ? date.toISOString().split('T')[0] : null;
  }, [date?.getFullYear(), date?.getMonth(), date?.getDate()]);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentDate = dateRef.current;
      const fetchedTasks = currentDate
        ? await tasksApi.getByDate(currentDate)
        : await tasksApi.getAll();
      setTasks(fetchedTasks);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateString]);

  const createTask = useCallback(async (data: TaskFormData): Promise<Task | null> => {
    // Create optimistic task with temporary ID
    const tempId = `temp-${Date.now()}`;
    const currentDate = dateRef.current;
    const currentTasks = tasksRef.current;
    const optimisticTask: Task = {
      id: tempId,
      title: data.title,
      description: data.description || null,
      isCompleted: false,
      priority: data.priority || 'medium',
      startTime: data.startTime ? new Date(data.startTime) : null,
      endTime: data.endTime ? new Date(data.endTime) : null,
      duration: null,
      date: currentDate || new Date(),
      category: null,
      categoryId: null,
      order: currentTasks.length, // Add order based on current task count
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update - add task immediately
    setTasks((prev) => [...prev, optimisticTask]);

    try {
      const newTask = await tasksApi.create({
        ...data,
        date: currentDate || new Date(),
      });
      // Replace optimistic task with real task from server
      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? newTask : task))
      );
      return newTask;
    } catch (err) {
      // Revert on error - remove optimistic task
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      console.error('Error creating task:', err);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>): Promise<Task | null> => {
    // Store original task for potential rollback
    const currentTasks = tasksRef.current;
    const originalTask = currentTasks.find((t) => t.id === id);
    
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...data, updatedAt: new Date() } : task))
    );

    try {
      const updatedTask = await tasksApi.update(id, data);
      // Replace with server response
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      // Revert on error
      if (originalTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? originalTask : task))
        );
      }
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      console.error('Error updating task:', err);
      return null;
    }
  }, []);

  const toggleComplete = useCallback(async (id: string, isCompleted: boolean): Promise<void> => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted } : task
      )
    );
    
    try {
      await tasksApi.toggleComplete(id, isCompleted);
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, isCompleted: !isCompleted } : task
        )
      );
      const message = err instanceof Error ? err.message : 'Failed to toggle task';
      setError(message);
      console.error('Error toggling task:', err);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    // Store task for potential rollback
    const currentTasks = tasksRef.current;
    const taskToDelete = currentTasks.find((t) => t.id === id);
    
    // Optimistic update
    setTasks((prev) => prev.filter((task) => task.id !== id));
    
    try {
      await tasksApi.delete(id);
    } catch (err) {
      // Revert on error
      if (taskToDelete) {
        setTasks((prev) => [...prev, taskToDelete]);
      }
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      console.error('Error deleting task:', err);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [autoFetch, fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
  };
}

export default useTasks;
