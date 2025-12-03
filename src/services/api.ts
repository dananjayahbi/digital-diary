import type { Task, TaskFormData, DiaryEntry, Category, Streak, DailyPrompt, MoodType } from '@/types';

const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============ TASKS API ============

export const tasksApi = {
  // Get all tasks for a specific date
  getByDate: async (date: Date): Promise<Task[]> => {
    const dateStr = date.toISOString().split('T')[0];
    return fetchApi<Task[]>(`/tasks?date=${dateStr}`);
  },

  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    return fetchApi<Task[]>('/tasks');
  },

  // Get a single task by ID
  getById: async (id: string): Promise<Task> => {
    return fetchApi<Task>(`/tasks/${id}`);
  },

  // Create a new task
  create: async (data: TaskFormData): Promise<Task> => {
    return fetchApi<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        date: data.date?.toISOString(),
      }),
    });
  },

  // Update a task
  update: async (id: string, data: Partial<Task>): Promise<Task> => {
    return fetchApi<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Toggle task completion
  toggleComplete: async (id: string, isCompleted: boolean): Promise<Task> => {
    return fetchApi<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    });
  },

  // Delete a task
  delete: async (id: string): Promise<void> => {
    await fetchApi(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ DIARY API ============

export const diaryApi = {
  // Get diary entries for a specific date
  getByDate: async (date: Date): Promise<DiaryEntry[]> => {
    const dateStr = date.toISOString().split('T')[0];
    return fetchApi<DiaryEntry[]>(`/diary?date=${dateStr}`);
  },

  // Get all diary entries (with optional limit)
  getAll: async (limit?: number): Promise<DiaryEntry[]> => {
    const params = limit ? `?limit=${limit}` : '';
    return fetchApi<DiaryEntry[]>(`/diary${params}`);
  },

  // Get a single diary entry by ID
  getById: async (id: string): Promise<DiaryEntry> => {
    return fetchApi<DiaryEntry>(`/diary/${id}`);
  },

  // Create a new diary entry
  create: async (data: {
    content: string;
    mood?: MoodType;
    moodScore?: number;
    prompt?: string;
    location?: string;
    title?: string;
  }): Promise<DiaryEntry> => {
    return fetchApi<DiaryEntry>('/diary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a diary entry
  update: async (id: string, data: Partial<DiaryEntry>): Promise<DiaryEntry> => {
    return fetchApi<DiaryEntry>(`/diary/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a diary entry
  delete: async (id: string): Promise<void> => {
    await fetchApi(`/diary/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ CATEGORIES API ============

export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    return fetchApi<Category[]>('/categories');
  },

  // Create a new category
  create: async (data: { name: string; color?: string; icon?: string }): Promise<Category> => {
    return fetchApi<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============ STREAKS API ============

export const streaksApi = {
  // Get all streaks
  getAll: async (): Promise<{ streaks: Streak[]; activeDays: Date[] }> => {
    return fetchApi('/streaks');
  },

  // Get streak by type
  getByType: async (type: string): Promise<{ streaks: Streak[]; activeDays: Date[] }> => {
    return fetchApi(`/streaks?type=${type}`);
  },

  // Record activity for a streak type
  recordActivity: async (type: string): Promise<Streak> => {
    return fetchApi<Streak>('/streaks', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  },
};

// ============ PROMPTS API ============

export const promptsApi = {
  // Get the daily prompt
  getDaily: async (): Promise<DailyPrompt> => {
    return fetchApi<DailyPrompt>('/prompts');
  },
};

// Export all APIs as a single object for convenience
export const api = {
  tasks: tasksApi,
  diary: diaryApi,
  categories: categoriesApi,
  streaks: streaksApi,
  prompts: promptsApi,
};

export default api;
