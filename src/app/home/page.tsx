'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Leaf } from 'lucide-react';
import { Header, Sidebar } from '@/components/layout';
import {
  TaskTimeline,
  WeatherWidget,
  JournalCard,
  TaskModal,
  StreakWidget,
  DailyCard,
} from '@/components/common';
import { 
  Card, 
  SkeletonTaskTimeline, 
  SkeletonJournalCard, 
  SkeletonSidebar, 
  SkeletonWeatherWidget, 
  SkeletonStreakWidget, 
  SkeletonDailyCard,
  Skeleton,
} from '@/components/ui';
import { formatDate, getGreeting } from '@/lib/utils';
import { useTasks, useStreaks, usePrompt, useDiary } from '@/hooks';
import type { Task, TaskFormData, MoodType } from '@/types';

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Use custom hooks for data fetching
  const {
    tasks,
    isLoading: tasksLoading,
    toggleComplete,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  } = useTasks({ date: selectedDate });

  const {
    journalStreak,
    longestStreak,
    activeDays,
    isLoading: streaksLoading,
  } = useStreaks();

  const { prompt, isLoading: promptLoading } = usePrompt();
  const { createEntry } = useDiary({ autoFetch: false });

  // Refetch tasks when selected date changes
  useEffect(() => {
    fetchTasks();
  }, [selectedDate, fetchTasks]);

  const handleToggleComplete = useCallback(async (taskId: string, completed: boolean) => {
    await toggleComplete(taskId, completed);
  }, [toggleComplete]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = useCallback(async (taskId: string) => {
    await deleteTask(taskId);
  }, [deleteTask]);

  const handleSaveTask = useCallback(async (formData: TaskFormData) => {
    // Helper to convert time string to ISO date string
    const timeToISOString = (timeStr: string | undefined): string | undefined => {
      if (!timeStr) return undefined;
      const dateStr = selectedDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
      return new Date(`${dateStr}T${timeStr}:00`).toISOString();
    };

    if (editingTask) {
      // Update existing task
      await updateTask(editingTask.id, {
        ...formData,
        startTime: formData.startTime
          ? new Date(`${selectedDate.toISOString().split('T')[0]}T${formData.startTime}:00`)
          : null,
        endTime: formData.endTime
          ? new Date(`${selectedDate.toISOString().split('T')[0]}T${formData.endTime}:00`)
          : null,
      });
    } else {
      // Add new task - convert time strings to proper format
      await createTask({
        ...formData,
        startTime: timeToISOString(formData.startTime),
        endTime: timeToISOString(formData.endTime),
        date: selectedDate,
      });
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, [editingTask, selectedDate, createTask, updateTask]);

  const handleSaveJournal = useCallback(async (content: string, mood?: MoodType) => {
    const entry = await createEntry({
      content,
      mood,
      prompt,
    });
    
    if (entry) {
      console.log('Journal entry saved:', entry);
    }
  }, [createEntry, prompt]);

  const greeting = getGreeting();
  const todayDate = formatDate(new Date(), 'full');

  // Calculate completed tasks for progress
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen relative">
      <Header />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Greeting Section */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-2 text-white mb-2">
              <Sun size={18} className="text-primary" />
              <span className="text-sm font-medium">{todayDate}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {greeting}, <span className="text-primary">there</span>
            </h1>
            <p className="text-white mt-2">
              Let&apos;s make today meaningful and productive
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Tasks & Journal */}
            <div className="flex-1 space-y-6">
              {/* Task Timeline */}
              <Card variant="glass" padding="lg">
                {tasksLoading ? (
                  <SkeletonTaskTimeline count={3} />
                ) : (
                  <TaskTimeline
                    tasks={tasks}
                    onToggleComplete={handleToggleComplete}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                )}
              </Card>

              {/* Journal Card */}
              {promptLoading ? (
                <SkeletonJournalCard />
              ) : (
                <JournalCard
                  prompt={prompt}
                  onSave={handleSaveJournal}
                />
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Calendar Sidebar */}
              {streaksLoading ? (
                <SkeletonSidebar />
              ) : (
                <Sidebar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  streak={journalStreak}
                  completedTasks={completedTasks}
                  totalTasks={totalTasks}
                />
              )}

              {/* Weather Widget */}
              <WeatherWidget />

              {/* Streak Widget */}
              {streaksLoading ? (
                <SkeletonStreakWidget />
              ) : (
                <StreakWidget 
                  streak={journalStreak} 
                  longestStreak={longestStreak} 
                  activeDays={activeDays} 
                />
              )}

              {/* Daily Inspiration Card */}
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf size={16} className="text-primary" />
                  <span className="text-sm font-medium text-white">Daily Inspiration</span>
                </div>
                <DailyCard
                  imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop"
                  caption="Nature always wears the colors of the spirit"
                />
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description || undefined,
                startTime: editingTask.startTime
                  ? new Date(editingTask.startTime).toTimeString().slice(0, 5)
                  : undefined,
                endTime: editingTask.endTime
                  ? new Date(editingTask.endTime).toTimeString().slice(0, 5)
                  : undefined,
                priority: editingTask.priority,
              }
            : undefined
        }
        isEditing={!!editingTask}
      />
    </div>
  );
};

export default HomePage;
