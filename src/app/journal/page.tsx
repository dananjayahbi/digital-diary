'use client';

import React, { useState } from 'react';
import { Plus, Search, Calendar, Trash2, Edit3, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, Button, Input, TextArea, SkeletonEntryItem, Skeleton } from '@/components/ui';
import { useDiary } from '@/hooks';
import { formatDate, moodEmojis } from '@/lib/utils';
import type { DiaryEntry, MoodType } from '@/types';

const JournalPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  
  // Form state for creating/editing
  const [formContent, setFormContent] = useState('');
  const [formMood, setFormMood] = useState<MoodType | undefined>();
  const [formTitle, setFormTitle] = useState('');

  const { entries, isLoading, createEntry, updateEntry, deleteEntry, fetchEntries } = useDiary({ limit: 50 });

  const moods: { type: MoodType; label: string }[] = [
    { type: 'happy', label: 'Happy' },
    { type: 'calm', label: 'Calm' },
    { type: 'neutral', label: 'Neutral' },
    { type: 'sad', label: 'Sad' },
    { type: 'anxious', label: 'Anxious' },
  ];

  // Filter entries by search query
  const filteredEntries = entries.filter(entry => {
    const query = searchQuery.toLowerCase();
    return (
      entry.content.toLowerCase().includes(query) ||
      entry.title?.toLowerCase().includes(query) ||
      entry.mood?.toLowerCase().includes(query)
    );
  });

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, DiaryEntry[]>);

  const handleCreateEntry = async () => {
    if (!formContent.trim()) return;
    
    const entry = await createEntry({
      content: formContent,
      mood: formMood,
      title: formTitle || undefined,
    });
    
    if (entry) {
      setFormContent('');
      setFormMood(undefined);
      setFormTitle('');
      setIsCreating(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!selectedEntry || !formContent.trim()) return;
    
    await updateEntry(selectedEntry.id, {
      content: formContent,
      mood: formMood,
      title: formTitle || undefined,
    });
    
    setSelectedEntry(null);
    setFormContent('');
    setFormMood(undefined);
    setFormTitle('');
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(id);
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  const openEditor = (entry?: DiaryEntry) => {
    if (entry) {
      setSelectedEntry(entry);
      setFormContent(entry.content);
      setFormMood(entry.mood as MoodType | undefined);
      setFormTitle(entry.title || '');
      setIsCreating(false);
    } else {
      setSelectedEntry(null);
      setFormContent('');
      setFormMood(undefined);
      setFormTitle('');
      setIsCreating(true);
    }
  };

  const closeEditor = () => {
    setSelectedEntry(null);
    setIsCreating(false);
    setFormContent('');
    setFormMood(undefined);
    setFormTitle('');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + (direction === 'next' ? 1 : -1));
    setViewDate(newDate);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="text-primary" />
                Journal
              </h1>
              <p className="text-neutral-500 mt-1">
                Your thoughts, reflections, and memories
              </p>
            </div>
            <Button variant="primary" icon={Plus} onClick={() => openEditor()}>
              New Entry
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left - Entry List */}
            <div className="flex-1">
              {/* Search */}
              <Card variant="glass" padding="md" className="mb-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <Input
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Card>

              {/* Entries List */}
              <Card variant="glass" padding="lg">
                {isLoading ? (
                  <div className="space-y-6">
                    {/* Skeleton for date header */}
                    <div>
                      <Skeleton variant="text" height={14} width={150} className="mb-3" />
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <SkeletonEntryItem key={i} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Skeleton variant="text" height={14} width={150} className="mb-3" />
                      <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <SkeletonEntryItem key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen size={48} className="mx-auto text-neutral-300 mb-4" />
                    <h3 className="font-medium text-foreground mb-1">No entries yet</h3>
                    <p className="text-neutral-500 text-sm mb-4">
                      Start journaling to capture your thoughts
                    </p>
                    <Button variant="primary" icon={Plus} onClick={() => openEditor()}>
                      Write First Entry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedEntries).map(([dateStr, dayEntries]) => (
                      <div key={dateStr}>
                        <h3 className="text-sm font-semibold text-neutral-500 mb-3">
                          {formatDate(new Date(dateStr), 'full')}
                        </h3>
                        <div className="space-y-3">
                          {dayEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                selectedEntry?.id === entry.id
                                  ? 'border-primary bg-primary-muted'
                                  : 'border-neutral-200 hover:border-primary-light hover:bg-neutral-50'
                              }`}
                              onClick={() => openEditor(entry)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  {entry.title && (
                                    <h4 className="font-medium text-foreground mb-1 truncate">
                                      {entry.title}
                                    </h4>
                                  )}
                                  <p className="text-sm text-neutral-600 line-clamp-2">
                                    {entry.content}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    {entry.mood && (
                                      <span className="text-sm flex items-center gap-1">
                                        <span>{moodEmojis[entry.mood]}</span>
                                        <span className="text-neutral-400 capitalize">{entry.mood}</span>
                                      </span>
                                    )}
                                    <span className="text-xs text-neutral-400">
                                      {new Date(entry.date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEntry(entry.id);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-task-red/10 text-neutral-400 hover:text-task-red transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right - Editor Panel */}
            <div className="lg:w-[500px]">
              <Card variant="glass" padding="lg" className="sticky top-24">
                {isCreating || selectedEntry ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        {isCreating ? 'New Entry' : 'Edit Entry'}
                      </h3>
                      <button
                        onClick={closeEditor}
                        className="text-neutral-400 hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        placeholder="Title (optional)"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                      />

                      <TextArea
                        placeholder="Write your thoughts..."
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        className="min-h-[200px]"
                      />

                      {/* Mood Selection */}
                      <div>
                        <p className="text-sm text-neutral-500 mb-2">How are you feeling?</p>
                        <div className="flex flex-wrap gap-2">
                          {moods.map(({ type, label }) => (
                            <button
                              key={type}
                              onClick={() => setFormMood(formMood === type ? undefined : type)}
                              className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all
                                ${formMood === type 
                                  ? 'bg-primary text-white' 
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-foreground'
                                }
                              `}
                            >
                              <span>{moodEmojis[type]}</span>
                              <span>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button variant="ghost" onClick={closeEditor} className="flex-1">
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={isCreating ? handleCreateEntry : handleUpdateEntry}
                          disabled={!formContent.trim()}
                          className="flex-1"
                        >
                          {isCreating ? 'Save Entry' : 'Update Entry'}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Edit3 size={48} className="mx-auto text-neutral-300 mb-4" />
                    <h3 className="font-medium text-foreground mb-1">Select an entry</h3>
                    <p className="text-neutral-500 text-sm">
                      Click on an entry to view or edit, or create a new one
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JournalPage;
