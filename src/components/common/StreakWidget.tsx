'use client';

import React from 'react';
import { Flame } from 'lucide-react';
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
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-xs text-neutral-400">
                {weekDayLabels[index]}
              </span>
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${isTodayDate
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                    : isActive
                    ? 'bg-accent text-white'
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
      <div className="flex items-center justify-center gap-2 py-3 bg-accent-muted rounded-xl">
        <Flame size={20} className="text-accent" />
        <div className="text-center">
          <p className="font-bold text-accent">{streak} Day Streak</p>
          <p className="text-xs text-neutral-500">
            You&apos;re on fire! Keep the flame lit every day!
          </p>
        </div>
      </div>

      {/* Longest streak */}
      {longestStreak > 0 && (
        <p className="text-center text-xs text-neutral-400 mt-2">
          Longest streak: {longestStreak} days
        </p>
      )}
    </Card>
  );
};

export default StreakWidget;
