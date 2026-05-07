'use client';

import { useEffect, useRef, useState } from 'react';
import { usePaymentStore } from '@/store/paymentStore';
import { usePayment } from '@/hooks/usePayment';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import StepIndicator from '@/components/StepIndicator';
import OrderSummary from '@/components/OrderSummary';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory from '@/components/TransactionHistory';
import StatusScreen from '@/components/StatusScreen';
import ThemeToggle from '@/components/ThemeToggle';
import { saveTheme, type UiTheme } from '@/utils/storage';

export default function HomePage() {
  const {
    loadPersistedHistory,
    currentStep,
    transactionHistory,
    historyPanelOpen,
    setHistoryPanelOpen,
  } = usePaymentStore();
  const { status, currentTransaction, attemptCount, canRetry, handleRetry, handleReset } =
    usePayment();
  const [theme, setTheme] = useState<UiTheme>('dark');

  const orderRef = useRef<HTMLDivElement>(null);
  const payShellRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useFocusTrap(orderRef, currentStep === 'order');
  useFocusTrap(payShellRef, currentStep === 'payment');
  useFocusTrap(resultRef, currentStep === 'result');

  useEffect(() => {
    loadPersistedHistory();
  }, [loadPersistedHistory]);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    saveTheme(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <main className="min-h-screen bg-brand-bg px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <StepIndicator currentStep={currentStep} />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHistoryPanelOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-text transition-all hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <span>History</span>
              <span className="rounded-md bg-brand-card px-1.5 py-0.5 text-[10px] text-brand-muted">
                {transactionHistory.length}
              </span>
            </button>
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
          </div>
        </div>

        {currentStep === 'order' && (
          <div ref={orderRef} tabIndex={-1} className="outline-none">
            <OrderSummary />
          </div>
        )}

        {currentStep === 'payment' && (
          <div ref={payShellRef} tabIndex={-1} className="outline-none">
            <section className="glass mx-auto max-w-5xl rounded-2xl p-5 shadow-xl shadow-black/10 sm:p-8">
              <PaymentForm />
            </section>
          </div>
        )}

        {currentStep === 'result' && (
          <div
            ref={resultRef}
            tabIndex={-1}
            className="glass rounded-2xl p-6 shadow-xl shadow-black/10 outline-none sm:p-10"
          >
            <StatusScreen
              status={status}
              transaction={currentTransaction}
              attemptCount={attemptCount}
              canRetry={canRetry}
              onRetry={handleRetry}
              onReset={handleReset}
            />
          </div>
        )}
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
