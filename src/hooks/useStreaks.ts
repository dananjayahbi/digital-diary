'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { streaksApi } from '@/services/api';
import type { Streak } from '@/types';

interface UseStreaksReturn {
  journalStreak: number;
  longestStreak: number;
  activeDays: Date[];
  isLoading: boolean;
  error: string | null;
  fetchStreaks: () => Promise<void>;
  recordJournalActivity: () => Promise<void>;
}

export function useStreaks(): UseStreaksReturn {
  const [journalStreak, setJournalStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [activeDays, setActiveDays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid stale closures in callbacks
  const activeDaysRef = useRef(activeDays);
  const longestStreakRef = useRef(longestStreak);
  
  // Update refs when values change
  useEffect(() => {
    activeDaysRef.current = activeDays;
  }, [activeDays]);
  
  useEffect(() => {
    longestStreakRef.current = longestStreak;
  }, [longestStreak]);

  const fetchStreaks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await streaksApi.getAll();
      
      // Find journal streak
      const journalStreakData = data.streaks.find(
        (s: Streak) => s.type === 'journal'
      );
      
      if (journalStreakData) {
        setJournalStreak(journalStreakData.currentStreak);
        setLongestStreak(journalStreakData.longestStreak);
      }
      
      // Convert active days to Date objects
      if (data.activeDays) {
        setActiveDays(data.activeDays.map((d: string | Date) => new Date(d)));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch streaks';
      setError(message);
      console.error('Error fetching streaks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordJournalActivity = useCallback(async () => {
    try {
      const updatedStreak = await streaksApi.recordActivity('journal');
      setJournalStreak(updatedStreak.currentStreak);
      setLongestStreak(Math.max(updatedStreak.longestStreak, longestStreakRef.current));
      
      // Add today to active days if not already present
      const today = new Date();
      const todayStr = today.toDateString();
      const currentActiveDays = activeDaysRef.current;
      
      if (!currentActiveDays.some((d) => d.toDateString() === todayStr)) {
        setActiveDays((prev) => [...prev, today]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to record activity';
      setError(message);
      console.error('Error recording journal activity:', err);
    }
  }, []);

  useEffect(() => {
    fetchStreaks();
  }, [fetchStreaks]);

  return {
    journalStreak,
    longestStreak,
    activeDays,
    isLoading,
    error,
    fetchStreaks,
    recordJournalActivity,
  };
}

export default useStreaks;
