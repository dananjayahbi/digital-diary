'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Sparkles } from 'lucide-react';
import { Header, Sidebar } from '@/components/layout';
import {
  TaskTimeline,
  WeatherWidget,
  JournalCard,
  TaskModal,
  StreakWidget,
  DailyCard,
} from '@/components/common';
import { Card } from '@/components/ui';
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
  } = useStreaks();

  const { prompt } = usePrompt();
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
    if (editingTask) {
      // Update existing task
      await updateTask(editingTask.id, {
        ...formData,
        startTime: formData.startTime
          ? new Date(`${selectedDate.toDateString()} ${formData.startTime}`)
          : null,
        endTime: formData.endTime
          ? new Date(`${selectedDate.toDateString()} ${formData.endTime}`)
          : null,
      });
    } else {
      // Add new task
      await createTask({
        ...formData,
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
    <div className="min-h-screen bg-background">
      {/* Dramatic Nature Background - Sunset over ocean */}
      <div
        className="bg-nature"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg')`,
        }}
      />

      <Header />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Greeting Section */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-2 text-neutral-400 mb-2">
              <Sun size={18} className="text-secondary" />
              <span className="text-sm font-medium">{todayDate}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {greeting}, <span className="text-gradient">there</span>
            </h1>
            <p className="text-neutral-400 mt-2 text-lg">
              Let&apos;s make today meaningful and productive
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Tasks & Journal */}
            <div className="flex-1 space-y-6">
              {/* Task Timeline */}
              <Card variant="glass" padding="lg">
                <TaskTimeline
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </Card>

              {/* Journal Card */}
              <JournalCard
                prompt={prompt}
                onSave={handleSaveJournal}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Calendar Sidebar */}
              <Sidebar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                streak={journalStreak}
                completedTasks={completedTasks}
                totalTasks={totalTasks}
              />

              {/* Weather Widget */}
              <WeatherWidget />

              {/* Streak Widget */}
              <StreakWidget 
                streak={journalStreak} 
                longestStreak={longestStreak} 
                activeDays={activeDays} 
              />

              {/* Daily Inspiration Card */}
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-accent" />
                  <span className="text-sm font-medium">Daily Inspiration</span>
                </div>
                <DailyCard
                  imageUrl="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=500&fit=crop"
                  caption="A world full of flowers, where would it be?"
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
