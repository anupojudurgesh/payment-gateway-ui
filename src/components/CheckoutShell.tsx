'use client';

import { Suspense, useEffect, useSyncExternalStore } from 'react';
import { usePaymentStore } from '@/store/paymentStore';
import TransactionHistory from '@/components/TransactionHistory';
import StepIndicator from '@/components/StepIndicator';
import ThemeToggle from '@/components/ThemeToggle';
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setStoredTheme,
  subscribeTheme,
} from '@/utils/themeExternalStore';
import type { UiTheme } from '@/utils/storage';

interface CheckoutShellProps {
  readonly children: React.ReactNode;
}

export default function CheckoutShell({ children }: CheckoutShellProps) {
  const {
    loadPersistedHistory,
    transactionHistory,
    historyPanelOpen,
    setHistoryPanelOpen,
  } = usePaymentStore();

  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  useEffect(() => {
    loadPersistedHistory();
  }, [loadPersistedHistory]);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  const handleThemeToggle = () => {
    const next: UiTheme = theme === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
  };

  return (
    <main className="min-h-screen bg-brand-bg px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Suspense
            fallback={
              <div
                className="h-9 min-w-[200px] rounded-full bg-brand-card/80 motion-safe:animate-pulse"
                aria-hidden
              />
            }
          >
            <StepIndicator />
          </Suspense>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setHistoryPanelOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-text transition-all hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <span>Transaction History</span>
              <span className="rounded-md bg-brand-card px-1.5 py-0.5 text-[10px] text-brand-muted">
                {transactionHistory.length}
              </span>
            </button>
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
          </div>
        </div>

        {children}
      </div>

      <button
        type="button"
        aria-label="Close history panel"
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          historyPanelOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setHistoryPanelOpen(false)}
      />
      <aside
        className={`glass fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-brand-border shadow-2xl shadow-black/40 transition-transform duration-300 ${
          historyPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h2 className="text-sm font-semibold text-brand-text">Transaction History</h2>
          <button
            type="button"
            onClick={() => setHistoryPanelOpen(false)}
            className="rounded-md border border-brand-border px-2 py-1 text-xs font-semibold text-brand-text hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            Close
          </button>
        </div>
        <TransactionHistory />
      </aside>
    </main>
  );
}
