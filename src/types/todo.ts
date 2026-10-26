export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Study' | 'Work' | 'Personal' | 'Health' | 'Coding';

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string; // YYYY-MM-DD
  createdAt: number; // timestamp
  completedAt?: number;
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
  percentage: number;
}

export const CATEGORIES: Category[] = ['Study', 'Work', 'Personal', 'Health', 'Coding'];

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' }
];
