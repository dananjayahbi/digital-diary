'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
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

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="glass rounded-2xl p-5 space-y-6">
        {/* Streak Display */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/10 to-task-orange/10 rounded-xl">
          <div>
            <p className="text-sm text-neutral-500">Current Streak</p>
            <p className="text-2xl font-bold text-accent">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <Flame size={24} className="text-accent" />
          </div>
        </div>

        {/* Mini Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1.5 rounded-lg hover:bg-primary-muted transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-sm">{formatMonthYear(viewDate)}</span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1.5 rounded-lg hover:bg-primary-muted transition-colors"
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
                    aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                    ${!isCurrentMonth ? 'text-neutral-300' : 'text-foreground'}
                    ${isTodayDate && !isSelected ? 'font-bold text-primary' : ''}
                    ${isSelected ? 'bg-primary text-white font-semibold' : 'hover:bg-primary-muted'}
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
          <h4 className="text-sm font-semibold mb-3 text-neutral-500">Today&apos;s Progress</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Tasks Completed</span>
              <span className="font-semibold text-primary">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
