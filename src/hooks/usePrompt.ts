'use client';

import { useState, useEffect, useCallback } from 'react';
import { promptsApi } from '@/services/api';
import type { DailyPrompt } from '@/types';

interface UsePromptReturn {
  prompt: string;
  isLoading: boolean;
  error: string | null;
  fetchPrompt: () => Promise<void>;
}

export function usePrompt(): UsePromptReturn {
  const [prompt, setPrompt] = useState<string>(
    "Take a moment to reflect on your day. What are you grateful for?"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompt = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await promptsApi.getDaily();
      if (data.content) {
        setPrompt(data.content);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch prompt';
      setError(message);
      console.error('Error fetching prompt:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompt();
  }, [fetchPrompt]);

  return {
    prompt,
    isLoading,
    error,
    fetchPrompt,
  };
}

export default usePrompt;
