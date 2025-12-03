'use client';

import React from 'react';
import { Flame, Zap } from 'lucide-react';
import { Card } from '@/components/ui';
import { getCurrentWeekDates, isToday, isSameDay } from '@/lib/utils';

interface StreakWidgetProps {
  streak: number;
  longestStreak?: number;
  activeDays?: Date[];
}

const StreakWidget: React.FC<StreakWidgetProps> = ({
  streak = 1,
  longestStreak = 0,
  activeDays = [],
}) => {
  const weekDates = getCurrentWeekDates();
  const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const today = new Date();

  const isDayActive = (date: Date) => {
    return activeDays.some((d) => isSameDay(d, date));
  };

  return (
    <Card variant="glass" padding="md">
      {/* Week view */}
      <div className="flex justify-between items-center gap-1 mb-4">
        {weekDates.map((date, index) => {
          const isTodayDate = isToday(date);
          const isActive = isDayActive(date) || isTodayDate;
          const isPast = date < today && !isTodayDate;

          return (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-neutral-500 font-medium">
                {weekDayLabels[index]}
              </span>
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300
                  ${isTodayDate
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white ring-2 ring-primary/50 ring-offset-2 ring-offset-neutral-900 shadow-lg shadow-primary/30'
                    : isActive
                    ? 'bg-gradient-to-br from-accent to-accent-light text-white shadow-md shadow-accent/20'
                    : isPast
                    ? 'bg-neutral-800 text-neutral-500'
                    : 'bg-neutral-800/50 text-neutral-400'
                  }
                `}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Streak info */}
      <div className="relative overflow-hidden flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-accent/20 via-secondary/10 to-accent/20 rounded-xl border border-accent/20">
        <div className="absolute inset-0 animate-shimmer" />
        <Flame size={24} className="text-accent relative z-10" />
        <div className="text-center relative z-10">
          <p className="font-bold text-lg text-gradient-warm">{streak} Day Streak</p>
          <p className="text-xs text-neutral-400">
            You&apos;re on fire! Keep the flame lit every day!
          </p>
        </div>
      </div>

      {/* Longest streak */}
      {longestStreak > 0 && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-neutral-500">
          <Zap size={14} className="text-secondary" />
          <span>Longest streak: <span className="font-semibold text-secondary">{longestStreak} days</span></span>
        </div>
      )}
    </Card>
  );
};

export default StreakWidget;
