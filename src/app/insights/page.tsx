'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  BookOpen,
  Smile,
  Frown,
  Meh,
  Target,
  Award
} from 'lucide-react';
import { Header } from '@/components/layout';
import { Card } from '@/components/ui';
import { useStreaks, useDiary, useTasks } from '@/hooks';
import { formatDate, moodEmojis } from '@/lib/utils';
import type { DiaryEntry, Task } from '@/types';

const InsightsPage = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  const { journalStreak, longestStreak, activeDays } = useStreaks();
  const { entries } = useDiary({ limit: 100 });
  const { tasks } = useTasks({});

  // Calculate mood statistics
  const moodStats = entries.reduce((stats, entry) => {
    if (entry.mood) {
      stats[entry.mood] = (stats[entry.mood] || 0) + 1;
    }
    return stats;
  }, {} as Record<string, number>);

  const totalMoodEntries = Object.values(moodStats).reduce((a, b) => a + b, 0);
  const mostCommonMood = Object.entries(moodStats).sort((a, b) => b[1] - a[1])[0];

  // Calculate task statistics
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get tasks by priority
  const tasksByPriority = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  // Weekly activity data
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const data = days.map((day, index) => {
      const date = new Date(today);
      const currentDay = today.getDay();
      const diff = index - (currentDay === 0 ? 6 : currentDay - 1);
      date.setDate(today.getDate() + diff);
      
      const dayEntries = entries.filter(e => 
        new Date(e.date).toDateString() === date.toDateString()
      ).length;
      
      const dayTasks = tasks.filter(t => 
        new Date(t.date).toDateString() === date.toDateString() && t.isCompleted
      ).length;
      
      return {
        day,
        date,
        entries: dayEntries,
        tasks: dayTasks,
        total: dayEntries + dayTasks,
      };
    });
    return data;
  };

  const weeklyData = getWeeklyData();
  const maxActivity = Math.max(...weeklyData.map(d => d.total), 1);

  // Mood icon component
  const MoodIcon = ({ mood, size = 20 }: { mood: string; size?: number }) => {
    switch (mood) {
      case 'happy':
        return <Smile size={size} className="text-task-green" />;
      case 'sad':
        return <Frown size={size} className="text-task-blue" />;
      case 'anxious':
        return <Meh size={size} className="text-task-orange" />;
      default:
        return <Meh size={size} className="text-neutral-400" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="text-primary" />
                Insights
              </h1>
              <p className="text-neutral-500 mt-1">
                Track your progress and discover patterns
              </p>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-primary text-white'
                      : 'bg-white/50 text-neutral-600 hover:bg-white/80'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Streak Card */}
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Flame size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">{journalStreak}</p>
                  <p className="text-sm text-neutral-500">Day Streak</p>
                </div>
              </div>
            </Card>

            {/* Longest Streak */}
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-task-orange/20 flex items-center justify-center">
                  <Award size={24} className="text-task-orange" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-task-orange">{longestStreak}</p>
                  <p className="text-sm text-neutral-500">Best Streak</p>
                </div>
              </div>
            </Card>

            {/* Journal Entries */}
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-task-purple/20 flex items-center justify-center">
                  <BookOpen size={24} className="text-task-purple" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-task-purple">{entries.length}</p>
                  <p className="text-sm text-neutral-500">Journal Entries</p>
                </div>
              </div>
            </Card>

            {/* Completion Rate */}
            <Card variant="glass" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-task-green/20 flex items-center justify-center">
                  <Target size={24} className="text-task-green" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-task-green">{completionRate}%</p>
                  <p className="text-sm text-neutral-500">Task Completion</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity Chart */}
            <Card variant="glass" padding="lg">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                Weekly Activity
              </h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1 items-center">
                      {/* Tasks bar */}
                      <div
                        className="w-full max-w-[32px] bg-task-blue/80 rounded-t transition-all"
                        style={{ height: `${(day.tasks / maxActivity) * 100}px` }}
                        title={`${day.tasks} tasks`}
                      />
                      {/* Journal bar */}
                      <div
                        className="w-full max-w-[32px] bg-task-purple/80 rounded-b transition-all"
                        style={{ height: `${(day.entries / maxActivity) * 100}px` }}
                        title={`${day.entries} entries`}
                      />
                    </div>
                    <span className="text-xs text-neutral-500">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-task-blue/80" />
                  <span className="text-sm text-neutral-500">Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-task-purple/80" />
                  <span className="text-sm text-neutral-500">Journal</span>
                </div>
              </div>
            </Card>

            {/* Mood Distribution */}
            <Card variant="glass" padding="lg">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Smile size={18} className="text-primary" />
                Mood Distribution
              </h3>
              {totalMoodEntries > 0 ? (
                <>
                  <div className="space-y-3">
                    {Object.entries(moodStats).map(([mood, count]) => {
                      const percentage = Math.round((count / totalMoodEntries) * 100);
                      return (
                        <div key={mood} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 capitalize">
                              <span className="text-lg">{moodEmojis[mood]}</span>
                              {mood}
                            </span>
                            <span className="text-neutral-500">{percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                mood === 'happy' ? 'bg-task-green' :
                                mood === 'calm' ? 'bg-task-blue' :
                                mood === 'neutral' ? 'bg-neutral-400' :
                                mood === 'sad' ? 'bg-task-purple' :
                                'bg-task-orange'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {mostCommonMood && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 text-center">
                      <p className="text-sm text-neutral-500">Most common mood</p>
                      <p className="text-lg font-semibold text-foreground capitalize flex items-center justify-center gap-2">
                        <span className="text-2xl">{moodEmojis[mostCommonMood[0]]}</span>
                        {mostCommonMood[0]}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Meh size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No mood data yet</p>
                  <p className="text-sm">Start journaling to track your moods</p>
                </div>
              )}
            </Card>

            {/* Task Statistics */}
            <Card variant="glass" padding="lg">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary" />
                Task Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-task-red/10">
                  <p className="text-2xl font-bold text-task-red">{tasksByPriority.high}</p>
                  <p className="text-xs text-neutral-500">High Priority</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-task-blue/10">
                  <p className="text-2xl font-bold text-task-blue">{tasksByPriority.medium}</p>
                  <p className="text-xs text-neutral-500">Medium Priority</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-task-green/10">
                  <p className="text-2xl font-bold text-task-green">{tasksByPriority.low}</p>
                  <p className="text-xs text-neutral-500">Low Priority</p>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-500">Completion Progress</span>
                  <span className="text-sm font-medium">{completedTasks}/{totalTasks}</span>
                </div>
                <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Streak Calendar */}
            <Card variant="glass" padding="lg">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Activity Calendar
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs text-neutral-400 py-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 28 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - 27 + i);
                  const isActive = activeDays.some(
                    d => new Date(d).toDateString() === date.toDateString()
                  );
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded flex items-center justify-center text-xs transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : isToday
                          ? 'bg-primary-muted text-primary ring-1 ring-primary'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                      title={formatDate(date, 'short')}
                    >
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
