// Task types
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  duration?: number | null;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  categoryId?: string | null;
  category?: Category | null;
  date: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  priority: 'low' | 'medium' | 'high';
  categoryId?: string;
  date?: Date;
}

// Category types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Diary entry types
export interface DiaryEntry {
  id: string;
  title?: string | null;
  content: string;
  mood?: MoodType | null;
  moodScore?: number | null;
  prompt?: string | null;
  weather?: string | null;
  location?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious';

export interface DiaryFormData {
  title?: string;
  content: string;
  mood?: MoodType;
  moodScore?: number;
  location?: string;
}

// Streak types
export interface Streak {
  id: string;
  type: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Daily prompt types
export interface DailyPrompt {
  id: string;
  content: string;
  author?: string | null;
  category?: string | null;
  isActive: boolean;
  createdAt: Date;
}

// Weather types (for the widget)
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  location: string;
  icon: string;
}

// Calendar types
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasEntries: boolean;
  hasTasks: boolean;
}

// Time block for timeline
export interface TimeBlock {
  hour: number;
  tasks: Task[];
}

// Motivational quote types
export interface MotivationalQuote {
  id: string;
  content: string;
  author?: string | null;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteFormData {
  content: string;
  author?: string;
  isFavorite?: boolean;
}
