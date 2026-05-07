'use client';

import type { UiTheme } from '@/utils/storage';

interface ThemeToggleProps {
  theme: UiTheme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: Readonly<ThemeToggleProps>) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle-shadow inline-flex items-center gap-2 rounded-md border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-text transition-all hover:scale-[1.02] hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="text-sm" aria-hidden>{isDark ? '🌙' : '☀️'}</span>
      <span>{isDark ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}
