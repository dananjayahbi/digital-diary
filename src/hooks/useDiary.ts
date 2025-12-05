'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { diaryApi } from '@/services/api';
import type { DiaryEntry, MoodType } from '@/types';

interface UseDiaryOptions {
  date?: Date;
  limit?: number;
  autoFetch?: boolean;
}

interface UseDiaryReturn {
  entries: DiaryEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  createEntry: (data: {
    content: string;
    mood?: MoodType;
    moodScore?: number;
    prompt?: string;
    location?: string;
    title?: string;
  }) => Promise<DiaryEntry | null>;
  updateEntry: (id: string, data: Partial<DiaryEntry>) => Promise<DiaryEntry | null>;
  deleteEntry: (id: string) => Promise<void>;
}

export function useDiary(options: UseDiaryOptions = {}): UseDiaryReturn {
  const { date, limit, autoFetch = true } = options;
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid stale closures in callbacks
  const dateRef = useRef(date);
  const entriesRef = useRef(entries);
  
  // Update refs when values change
  useEffect(() => {
    dateRef.current = date;
  }, [date]);
  
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);
  
  // Memoize date string to prevent unnecessary re-fetches
  const dateString = useMemo(() => {
    return date ? date.toISOString().split('T')[0] : null;
  }, [date?.getFullYear(), date?.getMonth(), date?.getDate()]);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentDate = dateRef.current;
      const fetchedEntries = currentDate
        ? await diaryApi.getByDate(currentDate)
        : await diaryApi.getAll(limit);
      setEntries(fetchedEntries);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch entries';
      setError(message);
      console.error('Error fetching diary entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateString, limit]);

  const createEntry = useCallback(async (data: {
    content: string;
    mood?: MoodType;
    moodScore?: number;
    prompt?: string;
    location?: string;
    title?: string;
  }): Promise<DiaryEntry | null> => {
    // Create optimistic entry with temporary ID
    const tempId = `temp-${Date.now()}`;
    const currentDate = dateRef.current;
    const optimisticEntry: DiaryEntry = {
      id: tempId,
      content: data.content,
      title: data.title || null,
      mood: data.mood || null,
      moodScore: data.moodScore || null,
      prompt: data.prompt || null,
      location: data.location || null,
      weather: null,
      date: currentDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update - add entry immediately at the beginning
    setEntries((prev) => [optimisticEntry, ...prev]);

    try {
      const newEntry = await diaryApi.create(data);
      // Replace optimistic entry with real entry from server
      setEntries((prev) =>
        prev.map((entry) => (entry.id === tempId ? newEntry : entry))
      );
      return newEntry;
    } catch (err) {
      // Revert on error - remove optimistic entry
      setEntries((prev) => prev.filter((entry) => entry.id !== tempId));
      const message = err instanceof Error ? err.message : 'Failed to create entry';
      setError(message);
      console.error('Error creating diary entry:', err);
      return null;
    }
  }, []);

  const updateEntry = useCallback(async (
    id: string,
    data: Partial<DiaryEntry>
  ): Promise<DiaryEntry | null> => {
    // Store original entry for potential rollback
    const currentEntries = entriesRef.current;
    const originalEntry = currentEntries.find((e) => e.id === id);
    
    // Optimistic update
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...data, updatedAt: new Date() } : entry))
    );

    try {
      const updatedEntry = await diaryApi.update(id, data);
      // Replace with server response
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
      return updatedEntry;
    } catch (err) {
      // Revert on error
      if (originalEntry) {
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? originalEntry : entry))
        );
      }
      const message = err instanceof Error ? err.message : 'Failed to update entry';
      setError(message);
      console.error('Error updating diary entry:', err);
      return null;
    }
  }, []);

  const deleteEntry = useCallback(async (id: string): Promise<void> => {
    const currentEntries = entriesRef.current;
    const entryToDelete = currentEntries.find((e) => e.id === id);
    
    // Optimistic update
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    
    try {
      await diaryApi.delete(id);
    } catch (err) {
      // Revert on error
      if (entryToDelete) {
        setEntries((prev) => [...prev, entryToDelete]);
      }
      const message = err instanceof Error ? err.message : 'Failed to delete entry';
      setError(message);
      console.error('Error deleting diary entry:', err);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchEntries();
    }
  }, [autoFetch, fetchEntries]);

  return {
    entries,
    isLoading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}

export default useDiary;
