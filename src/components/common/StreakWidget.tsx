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
              <span className="text-xs text-neutral-400 font-medium">
                {weekDayLabels[index]}
              </span>
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${isTodayDate
                    ? 'bg-primary text-white ring-2 ring-primary/30 ring-offset-2'
                    : isActive
                    ? 'bg-primary/80 text-white'
                    : isPast
                    ? 'bg-neutral-200 text-neutral-400'
                    : 'bg-neutral-100 text-neutral-500'
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
      <div className="flex items-center justify-center gap-3 py-4 bg-primary-muted rounded-xl border border-primary/10">
        <Flame size={24} className="text-primary" />
        <div className="text-center">
          <p className="font-bold text-lg text-primary">{streak} Day Streak</p>
          <p className="text-xs text-neutral-500">
            You&apos;re on fire! Keep the flame lit every day!
          </p>
        </div>
      </div>

      {/* Longest streak */}
      {longestStreak > 0 && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-neutral-500">
          <Zap size={14} className="text-primary" />
          <span>Longest streak: <span className="font-semibold text-primary">{longestStreak} days</span></span>
        </div>
      )}
    </Card>
  );
};

export default StreakWidget;
