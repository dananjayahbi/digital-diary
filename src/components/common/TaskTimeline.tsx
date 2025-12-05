'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Plus, Calendar, Leaf, Clock } from 'lucide-react';
import type { Task } from '@/types';
import TaskItem from './TaskItem';
import { Button, SkeletonTaskTimeline } from '@/components/ui';

interface TaskTimelineProps {
  tasks: Task[];
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  isLoading?: boolean;
  showCurrentTimeLine?: boolean;
  selectedDate?: Date;
}

// Current Time Marker Component - memoized to prevent unnecessary re-renders
const CurrentTimeMarker: React.FC<{ time: Date }> = React.memo(({ time }) => {
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex items-center gap-4 my-3 animate-fadeIn">
      {/* Time */}
      <div className="w-16 shrink-0 text-sm text-primary font-medium flex items-center gap-1">
        <Clock size={12} className="text-primary animate-pulse" />
        {formattedTime}
      </div>

      {/* Current time indicator */}
      <div className="relative flex items-center flex-1">
        <div className="absolute left-0 w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/30" />
        <div className="ml-1.5 flex-1 h-0.5 bg-linear-to-r from-primary via-primary/50 to-transparent rounded-full" />
      </div>

      {/* Label */}
      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
        Now
      </span>
    </div>
  );
});

CurrentTimeMarker.displayName = 'CurrentTimeMarker';

const TaskTimeline: React.FC<TaskTimelineProps> = ({
  tasks,
  onToggleComplete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isLoading = false,
  showCurrentTimeLine = true,
  selectedDate,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if selected date is today
  const isToday = useMemo(() => {
    if (!selectedDate) return true;
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  }, [selectedDate]);

  // Format the date for display
  const dateLabel = useMemo(() => {
    if (!selectedDate || isToday) return "Today's Schedule";
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }) + "'s Schedule";
  }, [selectedDate, isToday]);

  // Update current time every minute - only when showing today's schedule
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only start interval if we need to show current time marker
    if (showCurrentTimeLine && isToday) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000); // Update every minute
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [showCurrentTimeLine, isToday]);

  // Sort tasks by start time - closest upcoming tasks first
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [tasks]);

  // Find where to insert the current time marker (only show on today)
  const currentTimeIndex = useMemo(() => {
    if (!showCurrentTimeLine || !isToday) return -1;
    
    const now = currentTime.getTime();
    let insertIndex = sortedTasks.length; // Default to end

    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i];
      if (task.startTime) {
        const taskTime = new Date(task.startTime).getTime();
        if (taskTime > now) {
          insertIndex = i;
          break;
        }
      }
    }
    return insertIndex;
  }, [sortedTasks, currentTime, showCurrentTimeLine, isToday]);

  const completedCount = sortedTasks.filter(t => t.isCompleted).length;

  // Memoize handlers
  const handleToggleComplete = useCallback((taskId: string, completed: boolean) => {
    onToggleComplete(taskId, completed);
  }, [onToggleComplete]);

  if (isLoading) {
    return <SkeletonTaskTimeline count={3} />;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-muted">
            <Calendar size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{dateLabel}</h3>
            <p className="text-xs text-neutral-400">
              {completedCount} of {sortedTasks.length} tasks completed
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={Plus}
          onClick={onAddTask}
          className="hover:bg-primary-muted"
        >
          Add Task
        </Button>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-2xl animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-muted flex items-center justify-center">
            <Leaf size={28} className="text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-1">No tasks yet</h4>
          <p className="text-sm text-neutral-500 mb-4">
            Start your productive day by adding your first task
          </p>
          <Button variant="primary" size="sm" icon={Plus} onClick={onAddTask}>
            Add Your First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task, index) => (
            <React.Fragment key={task.id}>
              {/* Insert current time marker at the correct position */}
              {showCurrentTimeLine && index === currentTimeIndex && (
                <CurrentTimeMarker time={currentTime} />
              )}
              <TaskItem
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </React.Fragment>
          ))}
          {/* If current time is after all tasks, show marker at the end */}
          {showCurrentTimeLine && currentTimeIndex === sortedTasks.length && sortedTasks.length > 0 && (
            <CurrentTimeMarker time={currentTime} />
          )}
        </div>
      )}
    </div>
  );
};

export default TaskTimeline;
