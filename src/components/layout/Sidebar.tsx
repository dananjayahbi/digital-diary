'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { isToday, isSameDay, getCalendarDates } from '@/lib/utils';

interface SidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  streak?: number;
  completedTasks?: number;
  totalTasks?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedDate,
  onDateSelect,
  streak = 0,
  completedTasks = 0,
  totalTasks = 0,
}) => {
  const [viewDate, setViewDate] = React.useState(new Date());

  const calendarDates = getCalendarDates(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + (direction === 'next' ? 1 : -1));
    setViewDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="glass rounded-2xl p-5 space-y-6">
        {/* Streak Display */}
        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-accent/20 via-secondary/10 to-primary/20">
          <div className="absolute inset-0 animate-shimmer" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-gradient">
                {streak} <span className="text-lg font-normal text-neutral-300">{streak === 1 ? 'Day' : 'Days'}</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
              <Flame size={28} className="text-accent" />
            </div>
          </div>
        </div>

        {/* Mini Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-sm text-neutral-200">{formatMonthYear(viewDate)}</span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-neutral-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDates.map((date, index) => {
              const isCurrentMonth = date.getMonth() === viewDate.getMonth();
              const isTodayDate = isToday(date);
              const isSelected = isSameDay(date, selectedDate);

              return (
                <button
                  key={index}
                  onClick={() => onDateSelect(date)}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200
                    ${!isCurrentMonth ? 'text-neutral-600' : 'text-neutral-300'}
                    ${isTodayDate && !isSelected ? 'font-bold text-primary ring-1 ring-primary/50' : ''}
                    ${isSelected 
                      ? 'bg-gradient-to-br from-primary to-primary-dark text-white font-semibold shadow-lg shadow-primary/30' 
                      : 'hover:bg-white/10'
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-primary" />
            <h4 className="text-sm font-semibold text-neutral-300">Today&apos;s Progress</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-400">Tasks Completed</span>
              <span className="font-semibold text-primary">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-primary via-accent to-secondary"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && totalTasks > 0 && (
              <p className="text-xs text-center text-task-green animate-fadeIn">
                🎉 All tasks completed!
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
