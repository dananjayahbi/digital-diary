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
        <div className="p-4 rounded-xl bg-primary-muted border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-primary">
                {streak} <span className="text-lg font-normal text-neutral-600">{streak === 1 ? 'Day' : 'Days'}</span>
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Flame size={28} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Mini Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-sm text-foreground">{formatMonthYear(viewDate)}</span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-foreground"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-neutral-400 py-1"
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
                    aspect-square flex items-center justify-center text-sm rounded-lg transition-colors duration-150
                    ${!isCurrentMonth ? 'text-neutral-300' : 'text-neutral-700'}
                    ${isTodayDate && !isSelected ? 'font-bold text-primary ring-1 ring-primary' : ''}
                    ${isSelected 
                      ? 'bg-primary text-white font-semibold' 
                      : 'hover:bg-neutral-100'
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
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Today&apos;s Progress</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">Tasks Completed</span>
              <span className="font-semibold text-primary">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out bg-primary"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && totalTasks > 0 && (
              <p className="text-xs text-center text-primary animate-fadeIn">
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
