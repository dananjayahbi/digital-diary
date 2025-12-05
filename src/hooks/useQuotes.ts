'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { quotesApi } from '@/services/api';
import type { MotivationalQuote, QuoteFormData } from '@/types';

interface UseQuotesOptions {
  autoFetch?: boolean;
  randomOnly?: boolean;
}

interface UseQuotesReturn {
  quotes: MotivationalQuote[];
  randomQuote: MotivationalQuote | null;
  isLoading: boolean;
  error: string | null;
  fetchQuotes: () => Promise<void>;
  fetchRandomQuote: () => Promise<void>;
  createQuote: (data: QuoteFormData) => Promise<MotivationalQuote | null>;
  updateQuote: (id: string, data: Partial<QuoteFormData>) => Promise<MotivationalQuote | null>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
}

export function useQuotes(options: UseQuotesOptions = {}): UseQuotesReturn {
  const { autoFetch = true, randomOnly = false } = options;
  const [quotes, setQuotes] = useState<MotivationalQuote[]>([]);
  const [randomQuote, setRandomQuote] = useState<MotivationalQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to avoid stale closures in callbacks
  const quotesRef = useRef(quotes);
  
  useEffect(() => {
    quotesRef.current = quotes;
  }, [quotes]);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuotes = await quotesApi.getAll();
      setQuotes(fetchedQuotes);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch quotes';
      setError(message);
      console.error('Error fetching quotes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRandomQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const quote = await quotesApi.getRandom();
      setRandomQuote(quote);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch random quote';
      setError(message);
      console.error('Error fetching random quote:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createQuote = useCallback(async (data: QuoteFormData): Promise<MotivationalQuote | null> => {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticQuote: MotivationalQuote = {
      id: tempId,
      content: data.content,
      author: data.author || null,
      isFavorite: data.isFavorite || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setQuotes(prev => [optimisticQuote, ...prev]);
    
    try {
      const newQuote = await quotesApi.create(data);
      // Replace optimistic quote with real one
      setQuotes(prev => prev.map(q => q.id === tempId ? newQuote : q));
      return newQuote;
    } catch (err) {
      // Revert optimistic update
      setQuotes(prev => prev.filter(q => q.id !== tempId));
      const message = err instanceof Error ? err.message : 'Failed to create quote';
      setError(message);
      console.error('Error creating quote:', err);
      return null;
    }
  }, []);

  const updateQuote = useCallback(async (id: string, data: Partial<QuoteFormData>): Promise<MotivationalQuote | null> => {
    const currentQuotes = quotesRef.current;
    const originalQuote = currentQuotes.find(q => q.id === id);
    
    if (!originalQuote) return null;
    
    // Optimistic update
    setQuotes(prev => prev.map(q => 
      q.id === id ? { ...q, ...data, updatedAt: new Date() } : q
    ));
    
    try {
      const updatedQuote = await quotesApi.update(id, data);
      setQuotes(prev => prev.map(q => q.id === id ? updatedQuote : q));
      return updatedQuote;
    } catch (err) {
      // Revert optimistic update
      setQuotes(prev => prev.map(q => q.id === id ? originalQuote : q));
      const message = err instanceof Error ? err.message : 'Failed to update quote';
      setError(message);
      console.error('Error updating quote:', err);
      return null;
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string): Promise<void> => {
    const currentQuotes = quotesRef.current;
    const quote = currentQuotes.find(q => q.id === id);
    
    if (!quote) return;
    
    const newFavoriteState = !quote.isFavorite;
    
    // Optimistic update
    setQuotes(prev => prev.map(q => 
      q.id === id ? { ...q, isFavorite: newFavoriteState } : q
    ));
    
    try {
      await quotesApi.toggleFavorite(id, newFavoriteState);
    } catch (err) {
      // Revert optimistic update
      setQuotes(prev => prev.map(q => 
        q.id === id ? { ...q, isFavorite: quote.isFavorite } : q
      ));
      const message = err instanceof Error ? err.message : 'Failed to toggle favorite';
      setError(message);
      console.error('Error toggling favorite:', err);
    }
  }, []);

  const deleteQuote = useCallback(async (id: string): Promise<void> => {
    const currentQuotes = quotesRef.current;
    const originalQuotes = [...currentQuotes];
    
    // Optimistic update
    setQuotes(prev => prev.filter(q => q.id !== id));
    
    try {
      await quotesApi.delete(id);
    } catch (err) {
      // Revert optimistic update
      setQuotes(originalQuotes);
      const message = err instanceof Error ? err.message : 'Failed to delete quote';
      setError(message);
      console.error('Error deleting quote:', err);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      if (randomOnly) {
        fetchRandomQuote();
      } else {
        fetchQuotes();
      }
    }
  }, [autoFetch, randomOnly, fetchQuotes, fetchRandomQuote]);

  return {
    quotes,
    randomQuote,
    isLoading,
    error,
    fetchQuotes,
    fetchRandomQuote,
    createQuote,
    updateQuote,
    toggleFavorite,
    deleteQuote,
  };
}
