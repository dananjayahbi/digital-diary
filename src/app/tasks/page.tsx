'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, CheckCircle2, Circle, ListTodo, Clock, Trash2, Edit3 } from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, Button, Input, Badge } from '@/components/ui';
import { TaskModal } from '@/components/common';
import { useTasks } from '@/hooks';
import { formatDate, formatTime, formatDuration, priorityColors } from '@/lib/utils';
import type { Task, TaskFormData } from '@/types';

type FilterType = 'all' | 'completed' | 'pending' | 'today';
type SortType = 'time' | 'priority' | 'created';

const TasksPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('time');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const {
    tasks,
    isLoading,
    toggleComplete,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  } = useTasks({ date: selectedDate });

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Search filter
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      let matchesFilter = true;
      switch (filterType) {
        case 'completed':
          matchesFilter = task.isCompleted;
          break;
        case 'pending':
          matchesFilter = !task.isCompleted;
          break;
        case 'today':
          const today = new Date();
          const taskDate = new Date(task.date);
          matchesFilter = taskDate.toDateString() === today.toDateString();
          break;
      }
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortType) {
        case 'time':
          if (!a.startTime && !b.startTime) return 0;
          if (!a.startTime) return 1;
          if (!b.startTime) return -1;
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    await toggleComplete(taskId, completed);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleSaveTask = async (formData: TaskFormData) => {
    if (editingTask) {
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
      await createTask({
        ...formData,
        date: selectedDate,
      });
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Date navigation
  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Stats
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const pendingCount = tasks.filter(t => !t.isCompleted).length;
  const totalDuration = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <ListTodo className="text-primary" />
                Tasks
              </h1>
              <p className="text-neutral-500 mt-1">
                Manage your daily tasks and stay productive
              </p>
            </div>
            <Button variant="primary" icon={Plus} onClick={handleAddTask}>
              Add Task
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-task-blue/20 flex items-center justify-center">
                  <ListTodo size={20} className="text-task-blue" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                  <p className="text-sm text-neutral-500">Total Tasks</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-task-green/20 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-task-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                  <p className="text-sm text-neutral-500">Completed</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-task-orange/20 flex items-center justify-center">
                  <Circle size={20} className="text-task-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  <p className="text-sm text-neutral-500">Pending</p>
                </div>
              </div>
            </Card>
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-task-purple/20 flex items-center justify-center">
                  <Clock size={20} className="text-task-purple" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{formatDuration(totalDuration)}</p>
                  <p className="text-sm text-neutral-500">Total Time</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Date Navigation & Filters */}
          <Card variant="glass" padding="md" className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Date Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate(-1)}
                  className="p-2 rounded-lg hover:bg-primary-muted transition-colors"
                >
                  <Calendar size={18} className="text-neutral-500" />
                </button>
                <div className="text-center min-w-[180px]">
                  <p className="font-semibold text-foreground">{formatDate(selectedDate, 'full')}</p>
                </div>
                <button
                  onClick={() => navigateDate(1)}
                  className="p-2 rounded-lg hover:bg-primary-muted transition-colors"
                >
                  <Calendar size={18} className="text-neutral-500" />
                </button>
                <button
                  onClick={goToToday}
                  className="ml-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Today
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  className="px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="time">By Time</option>
                  <option value="priority">By Priority</option>
                  <option value="created">By Created</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Tasks List */}
          <Card variant="glass" padding="lg">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-neutral-500">Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <ListTodo size={48} className="mx-auto text-neutral-300 mb-4" />
                <h3 className="font-medium text-foreground mb-1">No tasks found</h3>
                <p className="text-neutral-500 text-sm mb-4">
                  {searchQuery || filterType !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Add your first task for today'}
                </p>
                <Button variant="primary" icon={Plus} onClick={handleAddTask}>
                  Add Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all ${
                      task.isCompleted
                        ? 'border-neutral-200 bg-neutral-50 opacity-70'
                        : 'border-neutral-200 hover:border-primary-light hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleComplete(task.id, !task.isCompleted)}
                        className="mt-0.5"
                      >
                        {task.isCompleted ? (
                          <CheckCircle2 size={22} className="text-task-green" />
                        ) : (
                          <Circle size={22} className="text-neutral-300 hover:text-primary transition-colors" />
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${task.isCompleted ? 'line-through text-neutral-400' : 'text-foreground'}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {task.startTime && (
                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                              <Clock size={12} />
                              {formatTime(new Date(task.startTime).toTimeString().slice(0, 5))}
                              {task.endTime && ` - ${formatTime(new Date(task.endTime).toTimeString().slice(0, 5))}`}
                            </span>
                          )}
                          {task.duration && (
                            <span className="text-xs text-neutral-400">
                              {formatDuration(task.duration)}
                            </span>
                          )}
                          <Badge
                            variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'info' : 'success'}
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                          {task.category && (
                            <Badge size="sm" color={task.category.color}>
                              {task.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-2 rounded-lg hover:bg-primary-muted text-neutral-400 hover:text-primary transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 rounded-lg hover:bg-task-red/10 text-neutral-400 hover:text-task-red transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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

export default TasksPage;
