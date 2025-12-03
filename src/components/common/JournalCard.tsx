'use client';

import React from 'react';
import { Sparkles, Clock, ThumbsUp, Heart, Share2, MapPin, PenLine } from 'lucide-react';
import { Card, TextArea, Button } from '@/components/ui';
import type { MoodType } from '@/types';
import { moodEmojis } from '@/lib/utils';

interface JournalCardProps {
  prompt?: string;
  onSave: (content: string, mood?: MoodType) => void;
  initialContent?: string;
  initialMood?: MoodType;
}

const JournalCard: React.FC<JournalCardProps> = ({
  prompt = "Take a moment to reflect on your day. What are you grateful for?",
  onSave,
  initialContent = '',
  initialMood,
}) => {
  const [content, setContent] = React.useState(initialContent);
  const [selectedMood, setSelectedMood] = React.useState<MoodType | undefined>(initialMood);
  const [isSaving, setIsSaving] = React.useState(false);

  const moods: { type: MoodType; label: string }[] = [
    { type: 'happy', label: 'Happy' },
    { type: 'calm', label: 'Calm' },
    { type: 'neutral', label: 'Neutral' },
    { type: 'sad', label: 'Sad' },
    { type: 'anxious', label: 'Anxious' },
  ];

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    await onSave(content, selectedMood);
    setIsSaving(false);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Card variant="glass" className="overflow-hidden">
      {/* Header with prompt */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/20 p-6 -m-5 mb-5 border-b border-white/10">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
            <Sparkles size={14} className="text-primary" />
            <span className="font-medium">Savor the Moment</span>
            <span className="ml-auto flex items-center gap-1.5 text-neutral-500">
              <Clock size={14} />
              {currentTime}
            </span>
          </div>
          <p className="text-xl font-medium text-foreground italic leading-relaxed">
            &quot;{prompt}&quot;
          </p>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button className="p-2.5 rounded-xl glass-subtle hover:bg-white/20 transition-all duration-300 group">
              <ThumbsUp size={18} className="text-neutral-400 group-hover:text-primary transition-colors" />
            </button>
            <button className="p-2.5 rounded-xl glass-subtle hover:bg-white/20 transition-all duration-300 group">
              <Heart size={18} className="text-neutral-400 group-hover:text-accent transition-colors" />
            </button>
            <button className="p-2.5 rounded-xl glass-subtle hover:bg-white/20 transition-all duration-300 group">
              <Share2 size={18} className="text-neutral-400 group-hover:text-secondary transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Writing prompt */}
      <div className="space-y-5">
        <div className="flex items-start gap-2">
          <PenLine size={16} className="text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-neutral-400">
            Use the card&apos;s prompt to take a small action, make a decision, affirm a belief, or reflect on an idea, and write it down:
          </p>
        </div>

        <TextArea
          placeholder="Feel free to journal your current thoughts or anything else you'd like..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] bg-neutral-900/50 border-neutral-700/50 text-neutral-200 placeholder:text-neutral-500 focus:border-primary/50"
        />

        {/* Mood Selection */}
        <div className="space-y-3">
          <p className="text-sm text-neutral-400 font-medium">How are you feeling?</p>
          <div className="flex flex-wrap gap-2">
            {moods.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setSelectedMood(selectedMood === type ? undefined : type)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300
                  ${selectedMood === type 
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30' 
                    : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/50'
                  }
                `}
              >
                <span className="text-base">{moodEmojis[type]}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location input */}
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <MapPin size={14} className="text-neutral-500" />
          <span className="italic">Where are you right now...</span>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!content.trim()}
            className="px-6"
          >
            Save Entry
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JournalCard;
