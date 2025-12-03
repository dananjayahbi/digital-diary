'use client';

import React from 'react';
import { MoreVertical, Clock, Zap } from 'lucide-react';
import type { Task } from '@/types';
import { formatTime, formatDuration } from '@/lib/utils';
import { Checkbox, SkeletonTaskItem } from '@/components/ui';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isLoading?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getCategoryColor = () => {
    if (task.category?.color) return task.category.color;
    switch (task.priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#22c55e';
      default:
        return '#22c55e';
    }
  };

  const color = getCategoryColor();

  if (isLoading) {
    return <SkeletonTaskItem />;
  }

  return (
    <div className="flex items-start gap-4 group animate-fadeIn">
      {/* Time */}
      <div className="w-16 shrink-0 text-sm text-neutral-400 pt-2 flex items-center gap-1">
        <Clock size={12} className="text-neutral-400" />
        {task.startTime && formatTime(new Date(task.startTime).toTimeString().slice(0, 5))}
      </div>

      {/* Timeline dot and connector */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <div
          className="w-0.5 flex-1 min-h-5 opacity-30"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Task Card */}
      <div
        className={`flex-1 glass rounded-xl p-4 ${
          task.isCompleted ? 'opacity-50' : ''
        }`}
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.isCompleted}
              onChange={(e) => onToggleComplete(task.id, e.target.checked)}
              color={color}
            />
            <div className="flex-1 min-w-0">
              <h4
                className={`font-medium text-foreground ${
                  task.isCompleted ? 'line-through text-neutral-400' : ''
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {task.duration && (
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Zap size={10} />
                    {formatDuration(task.duration)}
                  </span>
                )}
                {task.category && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${task.category.color}15`,
                      color: task.category.color,
                    }}
                  >
                    {task.category.name}
                  </span>
                )}
                {task.priority === 'high' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-medium">
                    High Priority
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-100 transition-opacity duration-150"
            >
              <MoreVertical size={16} className="text-neutral-400" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl py-1 z-20 shadow-lg border border-neutral-200 animate-fadeIn">
                  <button
                    onClick={() => {
                      onEdit?.(task);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;
