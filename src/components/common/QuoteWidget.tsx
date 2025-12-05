'use client';

import React, { memo, useCallback } from 'react';
import { Quote, RefreshCw, Heart } from 'lucide-react';
import { useQuotes } from '@/hooks';

interface QuoteWidgetProps {
  className?: string;
}

const QuoteWidget = memo(function QuoteWidget({ className = '' }: QuoteWidgetProps) {
  const { randomQuote, isLoading, fetchRandomQuote } = useQuotes({ randomOnly: true });

  const handleRefresh = useCallback(() => {
    fetchRandomQuote();
  }, [fetchRandomQuote]);

  if (isLoading && !randomQuote) {
    return (
      <div className={`glass-card rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Quote size={18} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Daily Motivation</span>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/3 mt-4"></div>
        </div>
      </div>
    );
  }

  if (!randomQuote) {
    return (
      <div className={`glass-card rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Quote size={18} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Daily Motivation</span>
        </div>
        <p className="text-neutral-500 text-sm italic">
          No quotes yet. Add some motivational quotes in settings!
        </p>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote size={18} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Daily Motivation</span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors duration-150"
          aria-label="Get new quote"
          disabled={isLoading}
        >
          <RefreshCw 
            size={14} 
            className={`text-neutral-400 hover:text-neutral-600 ${isLoading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      <blockquote className="relative">
        <p className="text-foreground text-lg leading-relaxed italic">
          &ldquo;{randomQuote.content}&rdquo;
        </p>
        {randomQuote.author && (
          <footer className="mt-3 flex items-center gap-2">
            <span className="text-neutral-500 text-base">— {randomQuote.author}</span>
            {randomQuote.isFavorite && (
              <Heart size={12} className="text-red-400 fill-red-400" />
            )}
          </footer>
        )}
      </blockquote>
    </div>
  );
});

export default QuoteWidget;
