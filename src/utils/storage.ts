import { Transaction } from '@/types';

const STORAGE_KEY = 'payment_history';
const THEME_KEY = 'payment_theme';

export type UiTheme = 'light' | 'dark';

export const saveHistory = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    console.error('Failed to save transaction history');
  }
};

export const loadHistory = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as Transaction[]) : [];
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const saveTheme = (theme: UiTheme): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    console.error('Failed to save theme');
  }
};

export const loadTheme = (): UiTheme | null => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === 'light' || value === 'dark') {
      return value;
    }
    return null;
  } catch {
    return null;
  }
};