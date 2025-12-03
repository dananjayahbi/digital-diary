import { type ClassValue, clsx } from 'clsx';

// Combine class names utility
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Format date utilities
export function formatDate(date: Date | string, format: 'full' | 'short' | 'time' | 'day' = 'full'): string {
  const d = new Date(date);
  
  switch (format) {
    case 'full':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    case 'day':
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
      });
    default:
      return d.toLocaleDateString();
  }
}

// Format time from 24h to 12h
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Get time string from Date
export function getTimeString(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

// Calculate duration between two times
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
}

// Format duration in minutes to human readable
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

// Get greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

// Get current week dates
export function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Check if date is today
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

// Get days in month for calendar
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Get calendar dates for a month (including days from prev/next months)
export function getCalendarDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  const startDayOfWeek = firstDay.getDay();
  const dates: Date[] = [];
  
  // Add days from previous month
  const prevMonthDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  for (let i = prevMonthDays; i > 0; i--) {
    const date = new Date(year, month, 1 - i);
    dates.push(date);
  }
  
  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i));
  }
  
  // Add days from next month to complete the grid
  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    dates.push(new Date(year, month + 1, i));
  }
  
  return dates;
}

// Mood emoji mapping
export const moodEmojis: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
};

// Priority colors
export const priorityColors: Record<string, string> = {
  low: 'var(--task-green)',
  medium: 'var(--task-blue)',
  high: 'var(--task-red)',
};

// Category default icons
export const categoryIcons: Record<string, string> = {
  work: 'Briefcase',
  health: 'Heart',
  personal: 'User',
  fitness: 'Dumbbell',
  food: 'Coffee',
  sleep: 'Moon',
  study: 'BookOpen',
  social: 'Users',
  creative: 'Palette',
  finance: 'DollarSign',
};
