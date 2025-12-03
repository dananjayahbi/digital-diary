'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import type { Task } from '@/types';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui';

interface TaskTimelineProps {
  tasks: Task[];
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TaskTimeline: React.FC<TaskTimelineProps> = ({
  tasks,
  onToggleComplete,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  // Sort tasks by start time
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today&apos;s Schedule</h3>
        <Button
          variant="ghost"
          size="sm"
          icon={Plus}
          onClick={onAddTask}
        >
          Add Task
        </Button>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-muted flex items-center justify-center">
            <Plus size={24} className="text-primary" />
          </div>
          <h4 className="font-medium text-foreground mb-1">No tasks yet</h4>
          <p className="text-sm text-neutral-500 mb-4">
            Start your day by adding your first task
          </p>
          <Button variant="primary" size="sm" icon={Plus} onClick={onAddTask}>
            Add Your First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskTimeline;
