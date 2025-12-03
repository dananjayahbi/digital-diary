'use client';

import React from 'react';
import { MoreVertical, Clock, Zap } from 'lucide-react';
import type { Task } from '@/types';
import { formatTime, formatDuration } from '@/lib/utils';
import { Checkbox } from '@/components/ui';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getCategoryColor = () => {
    if (task.category?.color) return task.category.color;
    switch (task.priority) {
      case 'high':
        return '#ef4444'; // Red
      case 'medium':
        return '#38bdf8'; // Primary blue
      default:
        return '#22c55e'; // Green
    }
  };

  const color = getCategoryColor();

  return (
    <div className="flex items-start gap-4 group animate-fadeIn">
      {/* Time */}
      <div className="w-16 shrink-0 text-sm text-neutral-400 pt-2 flex items-center gap-1">
        <Clock size={12} className="text-neutral-500" />
        {task.startTime && formatTime(new Date(task.startTime).toTimeString().slice(0, 5))}
      </div>

      {/* Timeline dot and connector */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: `${color}20`,
            boxShadow: `0 0 20px ${color}30`
          }}
        >
          <div
            className="w-3 h-3 rounded-full animate-pulse-glow"
            style={{ 
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`
            }}
          />
        </div>
        <div
          className="w-0.5 flex-1 min-h-[20px] opacity-50"
          style={{ 
            background: `linear-gradient(to bottom, ${color}, transparent)`
          }}
        />
      </div>

      {/* Task Card */}
      <div
        className={`flex-1 glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.01] ${
          task.isCompleted ? 'opacity-50' : ''
        }`}
        style={{
          borderLeft: `3px solid ${color}`
        }}
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
                className={`font-medium text-foreground transition-all ${
                  task.isCompleted ? 'line-through text-neutral-500' : ''
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {task.duration && (
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Zap size={10} />
                    {formatDuration(task.duration)}
                  </span>
                )}
                {task.category && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${task.category.color}25`,
                      color: task.category.color,
                      boxShadow: `0 0 10px ${task.category.color}20`
                    }}
                  >
                    {task.category.name}
                  </span>
                )}
                {task.priority === 'high' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
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
              className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all duration-300"
            >
              <MoreVertical size={16} className="text-neutral-400" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 glass-dark rounded-xl py-1.5 z-20 shadow-xl border border-white/10 animate-fadeIn">
                  <button
                    onClick={() => {
                      onEdit?.(task);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-300 hover:bg-white/10 hover:text-foreground transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(task.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
