import type { UiTheme } from '@/utils/storage';
import { THEME_STORAGE_KEY, loadTheme, saveTheme } from '@/utils/storage';

const listeners = new Set<() => void>();

export function getThemeSnapshot(): UiTheme {
  return loadTheme() ?? 'dark';
}

/** SSR / first paint — must match CheckoutShell until client hydrates. */
export function getThemeServerSnapshot(): UiTheme {
  return 'dark';
}

export function subscribeTheme(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };
  globalThis.window?.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onStoreChange);
    globalThis.window?.removeEventListener('storage', onStorage);
  };
}

function notify(): void {
  listeners.forEach((l) => {
    l();
  });
}

/** Persist preference and re-render subscribers (same tab). */
export function setStoredTheme(theme: UiTheme): void {
  saveTheme(theme);
  notify();
}
