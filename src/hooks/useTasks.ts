'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = date
        ? await tasksApi.getByDate(date)
        : await tasksApi.getAll();
      setTasks(fetchedTasks);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  const createTask = useCallback(async (data: TaskFormData): Promise<Task | null> => {
    try {
      const newTask = await tasksApi.create({
        ...data,
        date: date || new Date(),
      });
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      console.error('Error creating task:', err);
      return null;
    }
  }, [date]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>): Promise<Task | null> => {
    try {
      const updatedTask = await tasksApi.update(id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
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
    const taskToDelete = tasks.find((t) => t.id === id);
    
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
  }, [tasks]);

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
