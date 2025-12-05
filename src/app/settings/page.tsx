'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Bell, 
  Moon, 
  Sun, 
  Image,
  Save,
  RefreshCw,
  Check,
  X,
  Quote,
  Plus,
  Trash2,
  Heart,
  Edit2
} from 'lucide-react';
import { Header } from '@/components/layout';
import { Card, Button, Input, TextArea, Skeleton, SkeletonSettingsTab } from '@/components/ui';
import { useQuotes } from '@/hooks';

interface UserSettings {
  name: string;
  theme: 'light' | 'dark' | 'system';
  backgroundImage: string;
  notifications: {
    dailyReminder: boolean;
    reminderTime: string;
    streakAlerts: boolean;
  };
  privacy: {
    hideStreak: boolean;
  };
}

const defaultSettings: UserSettings = {
  name: 'User',
  theme: 'light',
  backgroundImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80',
  notifications: {
    dailyReminder: true,
    reminderTime: '09:00',
    streakAlerts: true,
  },
  privacy: {
    hideStreak: false,
  },
};

const backgroundImages = [
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&q=60',
  },
  {
    id: 'mountains',
    name: 'Mountains',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=60',
  },
  {
    id: 'lake',
    name: 'Lake',
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=200&q=60',
  },
  {
    id: 'beach',
    name: 'Beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=60',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=200&q=60',
  },
  {
    id: 'autumn',
    name: 'Autumn',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60',
  },
];

const SettingsPage = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'quotes' | 'notifications' | 'data'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  
  // Quote management state
  const [newQuoteContent, setNewQuoteContent] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [editQuoteContent, setEditQuoteContent] = useState('');
  const [editQuoteAuthor, setEditQuoteAuthor] = useState('');
  
  // Use quotes hook
  const { 
    quotes, 
    isLoading: quotesLoading, 
    createQuote, 
    updateQuote, 
    toggleFavorite, 
    deleteQuote 
  } = useQuotes();

  // Quote handlers
  const handleAddQuote = useCallback(async () => {
    if (!newQuoteContent.trim()) return;
    
    await createQuote({
      content: newQuoteContent.trim(),
      author: newQuoteAuthor.trim() || undefined,
    });
    
    setNewQuoteContent('');
    setNewQuoteAuthor('');
  }, [newQuoteContent, newQuoteAuthor, createQuote]);
  
  const handleStartEdit = useCallback((quote: { id: string; content: string; author?: string | null }) => {
    setEditingQuoteId(quote.id);
    setEditQuoteContent(quote.content);
    setEditQuoteAuthor(quote.author || '');
  }, []);
  
  const handleSaveEdit = useCallback(async () => {
    if (!editingQuoteId || !editQuoteContent.trim()) return;
    
    await updateQuote(editingQuoteId, {
      content: editQuoteContent.trim(),
      author: editQuoteAuthor.trim() || undefined,
    });
    
    setEditingQuoteId(null);
    setEditQuoteContent('');
    setEditQuoteAuthor('');
  }, [editingQuoteId, editQuoteContent, editQuoteAuthor, updateQuote]);
  
  const handleCancelEdit = useCallback(() => {
    setEditingQuoteId(null);
    setEditQuoteContent('');
    setEditQuoteAuthor('');
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      const storedSettings = localStorage.getItem('digital-diary-settings');
      if (storedSettings) {
        try {
          setSettings(JSON.parse(storedSettings));
        } catch (e) {
          console.error('Failed to parse settings:', e);
        }
      }
      // Simulate loading delay for better UX
      setTimeout(() => setIsLoading(false), 500);
    };
    loadSettings();
  }, []);

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('digital-diary-settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
    setIsSaving(false);
  };

  // Reset settings
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings(defaultSettings);
      localStorage.removeItem('digital-diary-settings');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'quotes', label: 'Quotes', icon: Quote },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: RefreshCw },
  ] as const;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <SettingsIcon className="text-primary" />
                Settings
              </h1>
              <p className="text-neutral-500 mt-1">
                Customize your Digital Diary experience
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RefreshCw size={16} />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
              >
                {saved ? (
                  <>
                    <Check size={16} />
                    Saved
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tabs Navigation */}
            <Card variant="glass" padding="none" className="h-fit">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-white/50 text-neutral-600'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>

            {/* Tab Content */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <SkeletonSettingsTab />
              ) : (
                <>
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                <Card variant="glass" padding="lg">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Profile Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Display Name
                      </label>
                      <Input
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        placeholder="Enter your name"
                      />
                      <p className="text-sm text-neutral-500 mt-1">
                        This name will be displayed in your journal entries
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <Card variant="glass" padding="lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Palette size={20} className="text-primary" />
                      Theme
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'system', label: 'System', icon: SettingsIcon },
                      ].map((theme) => {
                        const Icon = theme.icon;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => setSettings({ ...settings, theme: theme.id as UserSettings['theme'] })}
                            className={`p-4 rounded-lg border-2 transition-colors duration-100 ${
                              settings.theme === theme.id
                                ? 'border-primary bg-primary/10'
                                : 'border-neutral-200 hover:border-primary/50'
                            }`}
                          >
                            <Icon size={24} className={settings.theme === theme.id ? 'text-primary' : 'text-neutral-500'} />
                            <p className={`mt-2 font-medium ${settings.theme === theme.id ? 'text-primary' : 'text-neutral-600'}`}>
                              {theme.label}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </Card>

                  <Card variant="glass" padding="lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Image size={20} className="text-primary" />
                      Background Image
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {backgroundImages.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => setSettings({ ...settings, backgroundImage: bg.url })}
                          className={`relative overflow-hidden rounded-lg aspect-video border-2 transition-colors duration-100 ${
                            settings.backgroundImage === bg.url
                              ? 'border-primary ring-2 ring-primary ring-offset-2'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={bg.thumbnail}
                            alt={bg.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <span className="absolute bottom-2 left-2 text-white text-sm font-medium">
                            {bg.name}
                          </span>
                          {settings.backgroundImage === bg.url && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Custom URL
                      </label>
                      <Input
                        value={settings.backgroundImage}
                        onChange={(e) => setSettings({ ...settings, backgroundImage: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </Card>
                </div>
              )}

              {/* Quotes Tab */}
              {activeTab === 'quotes' && (
                <div className="space-y-6">
                  <Card variant="glass" padding="lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Quote size={20} className="text-primary" />
                      Add New Quote
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Quote Content *
                        </label>
                        <TextArea
                          value={newQuoteContent}
                          onChange={(e) => setNewQuoteContent(e.target.value)}
                          placeholder="Enter your motivational quote..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Author (optional)
                        </label>
                        <Input
                          value={newQuoteAuthor}
                          onChange={(e) => setNewQuoteAuthor(e.target.value)}
                          placeholder="Who said this?"
                        />
                      </div>
                      <Button 
                        onClick={handleAddQuote}
                        disabled={!newQuoteContent.trim()}
                      >
                        <Plus size={16} />
                        Add Quote
                      </Button>
                    </div>
                  </Card>

                  <Card variant="glass" padding="lg">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Quote size={20} className="text-primary" />
                      Your Quotes ({quotes.length})
                    </h2>
                    {quotesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse p-4 bg-white/50 rounded-lg">
                            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : quotes.length === 0 ? (
                      <p className="text-neutral-500 text-center py-8">
                        No quotes yet. Add your first motivational quote above!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {quotes.map((quote) => (
                          <div 
                            key={quote.id} 
                            className="p-4 bg-white/50 rounded-lg border border-neutral-100"
                          >
                            {editingQuoteId === quote.id ? (
                              <div className="space-y-3">
                                <TextArea
                                  value={editQuoteContent}
                                  onChange={(e) => setEditQuoteContent(e.target.value)}
                                  rows={2}
                                />
                                <Input
                                  value={editQuoteAuthor}
                                  onChange={(e) => setEditQuoteAuthor(e.target.value)}
                                  placeholder="Author (optional)"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleSaveEdit}>
                                    <Check size={14} />
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                    <X size={14} />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-foreground italic mb-2">
                                  &ldquo;{quote.content}&rdquo;
                                </p>
                                {quote.author && (
                                  <p className="text-sm text-neutral-500 mb-3">
                                    — {quote.author}
                                  </p>
                                )}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleFavorite(quote.id)}
                                    className={`p-1.5 rounded-lg hover:bg-white/50 transition-colors ${
                                      quote.isFavorite ? 'text-red-500' : 'text-neutral-400'
                                    }`}
                                    title={quote.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                  >
                                    <Heart 
                                      size={16} 
                                      className={quote.isFavorite ? 'fill-current' : ''} 
                                    />
                                  </button>
                                  <button
                                    onClick={() => handleStartEdit(quote)}
                                    className="p-1.5 rounded-lg hover:bg-white/50 transition-colors text-neutral-400 hover:text-primary"
                                    title="Edit quote"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Are you sure you want to delete this quote?')) {
                                        deleteQuote(quote.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-white/50 transition-colors text-neutral-400 hover:text-red-500"
                                    title="Delete quote"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <Card variant="glass" padding="lg">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Bell size={20} className="text-primary" />
                    Notification Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Daily Reminder</p>
                        <p className="text-sm text-neutral-500">Get reminded to write in your journal</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            dailyReminder: !settings.notifications.dailyReminder,
                          },
                        })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.dailyReminder ? 'bg-primary' : 'bg-neutral-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            settings.notifications.dailyReminder ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    {settings.notifications.dailyReminder && (
                      <div className="ml-4 pl-4 border-l-2 border-primary/20">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Reminder Time
                        </label>
                        <Input
                          type="time"
                          value={settings.notifications.reminderTime}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              reminderTime: e.target.value,
                            },
                          })}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Streak Alerts</p>
                        <p className="text-sm text-neutral-500">Get notified when your streak is at risk</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            streakAlerts: !settings.notifications.streakAlerts,
                          },
                        })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.streakAlerts ? 'bg-primary' : 'bg-neutral-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            settings.notifications.streakAlerts ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <Card variant="glass" padding="lg">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <RefreshCw size={20} className="text-primary" />
                    Data Management
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/50 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Export Data</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Download all your journal entries and tasks as a JSON file
                      </p>
                      <Button variant="outline" onClick={() => {
                        // In a real app, this would fetch from the API
                        alert('Export functionality would download your data as JSON');
                      }}>
                        Export to JSON
                      </Button>
                    </div>

                    <div className="p-4 bg-white/50 rounded-lg">
                      <h3 className="font-medium text-foreground mb-2">Import Data</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Restore your data from a previous export
                      </p>
                      <Button variant="outline" onClick={() => {
                        alert('Import functionality would allow you to upload a JSON file');
                      }}>
                        Import from JSON
                      </Button>
                    </div>

                    <div className="p-4 bg-task-red/10 rounded-lg border border-task-red/20">
                      <h3 className="font-medium text-task-red mb-2">Danger Zone</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Permanently delete all your data. This action cannot be undone.
                      </p>
                      <Button
                        variant="outline"
                        className="border-task-red text-task-red hover:bg-task-red hover:text-white"
                        onClick={() => {
                          if (confirm('Are you absolutely sure? This will delete all your data permanently.')) {
                            alert('In a real app, this would delete all your data');
                          }
                        }}
                      >
                        <X size={16} />
                        Delete All Data
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
