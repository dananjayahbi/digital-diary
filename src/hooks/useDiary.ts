'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEntries = date
        ? await diaryApi.getByDate(date)
        : await diaryApi.getAll(limit);
      setEntries(fetchedEntries);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch entries';
      setError(message);
      console.error('Error fetching diary entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [date, limit]);

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
    const optimisticEntry: DiaryEntry = {
      id: tempId,
      content: data.content,
      title: data.title || null,
      mood: data.mood || null,
      moodScore: data.moodScore || null,
      prompt: data.prompt || null,
      location: data.location || null,
      weather: null,
      date: date || new Date(),
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
  }, [date]);

  const updateEntry = useCallback(async (
    id: string,
    data: Partial<DiaryEntry>
  ): Promise<DiaryEntry | null> => {
    // Store original entry for potential rollback
    const originalEntry = entries.find((e) => e.id === id);
    
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
  }, [entries]);

  const deleteEntry = useCallback(async (id: string): Promise<void> => {
    const entryToDelete = entries.find((e) => e.id === id);
    
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
  }, [entries]);

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
