'use client';

import React, { useState } from 'react';
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
import type { Task, TaskFormData, MoodType } from '@/types';

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    // Demo tasks
    {
      id: '1',
      title: 'Morning Meditation',
      description: 'Start the day with 10 minutes of mindfulness',
      startTime: new Date(new Date().setHours(7, 0, 0, 0)),
      endTime: new Date(new Date().setHours(7, 15, 0, 0)),
      duration: 15,
      isCompleted: true,
      priority: 'medium',
      categoryId: null,
      category: { id: '1', name: 'Wellness', color: 'var(--task-purple)', icon: null, createdAt: new Date(), updatedAt: new Date() },
      date: new Date(),
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Morning Walk',
      description: 'Walk around the neighborhood',
      startTime: new Date(new Date().setHours(7, 30, 0, 0)),
      endTime: new Date(new Date().setHours(8, 30, 0, 0)),
      duration: 60,
      isCompleted: false,
      priority: 'high',
      categoryId: null,
      category: { id: '2', name: 'Fitness', color: 'var(--task-green)', icon: null, createdAt: new Date(), updatedAt: new Date() },
      date: new Date(),
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Breakfast & Journal',
      description: 'Have a healthy breakfast and write thoughts',
      startTime: new Date(new Date().setHours(8, 30, 0, 0)),
      endTime: new Date(new Date().setHours(9, 0, 0, 0)),
      duration: 30,
      isCompleted: false,
      priority: 'low',
      categoryId: null,
      category: { id: '3', name: 'Personal', color: 'var(--task-orange)', icon: null, createdAt: new Date(), updatedAt: new Date() },
      date: new Date(),
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: completed } : task
      )
    );
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleSaveTask = (formData: TaskFormData) => {
    if (editingTask) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...formData,
                startTime: formData.startTime
                  ? new Date(`${selectedDate.toDateString()} ${formData.startTime}`)
                  : null,
                endTime: formData.endTime
                  ? new Date(`${selectedDate.toDateString()} ${formData.endTime}`)
                  : null,
                updatedAt: new Date(),
              }
            : task
        )
      );
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description || null,
        startTime: formData.startTime
          ? new Date(`${selectedDate.toDateString()} ${formData.startTime}`)
          : null,
        endTime: formData.endTime
          ? new Date(`${selectedDate.toDateString()} ${formData.endTime}`)
          : null,
        duration: formData.duration || null,
        isCompleted: false,
        priority: formData.priority,
        categoryId: formData.categoryId || null,
        category: null,
        date: selectedDate,
        order: tasks.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveJournal = async (content: string, mood?: MoodType) => {
    console.log('Saving journal entry:', { content, mood });
    // TODO: Implement API call to save journal entry
  };

  const greeting = getGreeting();
  const todayDate = formatDate(new Date(), 'full');

  return (
    <div className="min-h-screen bg-background">
      {/* Nature Background */}
      <div
        className="bg-nature"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80')`,
        }}
      />

      <Header />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Greeting Section */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-2 text-neutral-500 mb-1">
              <Sun size={18} className="text-accent" />
              <span className="text-sm">{todayDate}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {greeting}, <span className="text-primary">there</span>
            </h1>
            <p className="text-neutral-500 mt-1">
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
                prompt="I slow down to hear the flowers bloom and feel the gentle touch of the breeze."
                onSave={handleSaveJournal}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Calendar Sidebar */}
              <Sidebar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                streak={1}
              />

              {/* Weather Widget */}
              <WeatherWidget />

              {/* Streak Widget */}
              <StreakWidget streak={1} longestStreak={7} activeDays={[new Date()]} />

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
