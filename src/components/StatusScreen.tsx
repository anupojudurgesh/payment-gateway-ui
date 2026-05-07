'use client';

import { useEffect, useRef, useState } from 'react';
import type { PaymentStatus, Transaction } from '@/types';
import { formatMoney } from '@/utils/formatCurrency';

interface StatusScreenProps {
  status: PaymentStatus;
  transaction: Transaction | null;
  attemptCount: number;
  canRetry: boolean;
  onRetry: () => void;
  onReset: () => void;
}

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="confetti-piece left-[8%] bg-brand-primary delay-0" />
      <div className="confetti-piece left-[18%] bg-brand-success delay-75" />
      <div className="confetti-piece left-[28%] bg-brand-timeout delay-100" />
      <div className="confetti-piece left-[38%] bg-brand-failed delay-150" />
      <div className="confetti-piece left-[48%] bg-white/90 delay-200" />
      <div className="confetti-piece left-[58%] bg-brand-primary delay-300" />
      <div className="confetti-piece left-[68%] bg-brand-success delay-500" />
      <div className="confetti-piece left-[78%] bg-brand-timeout delay-700" />
      <div className="confetti-piece left-[88%] bg-brand-failed delay-1000" />
      <div className="confetti-piece left-[14%] bg-white/80 delay-150" />
      <div className="confetti-piece left-[72%] bg-brand-primary delay-200" />
    </div>
  );
}

export default function StatusScreen({
  status,
  transaction,
  attemptCount,
  canRetry,
  onRetry,
  onReset,
}: Readonly<StatusScreenProps>) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [status]);

  const copyId = async () => {
    if (!transaction) return;
    try {
      await navigator.clipboard.writeText(transaction.id);
      setToast('Transaction ID copied');
      globalThis.setTimeout(() => setToast(null), 2200);
    } catch {
      setToast('Unable to copy');
      globalThis.setTimeout(() => setToast(null), 2200);
    }
  };

  const downloadReceipt = () => {
    setToast('Receipt download started (demo)');
    globalThis.setTimeout(() => setToast(null), 2200);
  };

  if (status === 'success') {
    return (
      <div className="animate-slide-up relative mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-8 px-4 py-10">
        <Confetti />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand-success bg-brand-success/10 animate-success-pop">
          <svg className="h-14 w-14 text-brand-success" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              className="check-path"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="relative text-center" tabIndex={-1} ref={headingRef}>
          <h2 className="text-3xl font-bold text-brand-success">Payment Successful</h2>
          <p className="mt-2 text-sm text-brand-muted">Transaction has been authorized and completed.</p>
        </div>

        {transaction && (
          <div className="glass relative w-full rounded-2xl p-6 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-brand-border bg-brand-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Amount Paid</p>
                <p className="mt-2 text-2xl font-bold text-brand-text">
                  {formatMoney(transaction.amount, transaction.currency)}
                </p>
                <p className="mt-1 text-xs text-brand-muted">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-brand-border bg-brand-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Payment For</p>
                <p className="mt-2 text-base font-semibold text-brand-text">
                  {transaction.productName?.trim() ? transaction.productName : 'No item selected'}
                </p>
                <span className="mt-2 inline-flex rounded-full border border-brand-success/40 bg-brand-success/15 px-3 py-1 text-xs font-semibold text-brand-success">
                  Paid
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-brand-border bg-brand-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Transaction ID</p>
              <div className="flex items-center gap-2">
                <span className="mt-2 truncate font-mono text-xs text-brand-text">
                  {transaction.id.slice(0, 13)}…
                </span>
                <button
                  type="button"
                  onClick={copyId}
                  className="shrink-0 rounded-md border border-brand-border px-2 py-1 text-xs font-semibold text-brand-text hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={downloadReceipt}
            className="rounded-md border border-brand-border px-6 py-3 text-sm font-semibold text-brand-text hover:border-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            Download Receipt
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-md bg-brand-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-primary/30 hover:bg-brand-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            New Payment
          </button>
        </div>

        {toast && (
          <output
            className="glass fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-brand-text"
          >
            {toast}
          </output>
        )}
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="animate-shake mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-12 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-brand-failed bg-brand-failed/10">
          <svg className="h-12 w-12 text-brand-failed" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div tabIndex={-1} ref={headingRef}>
          <h2 className="text-2xl font-bold text-brand-failed">Payment Failed</h2>
          <p className="mt-2 text-sm text-brand-muted">
            {transaction?.failureReason ?? 'Something went wrong'}
          </p>
          <p className="mt-4 text-sm text-brand-muted">Having trouble? Try a different card.</p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                i <= attemptCount ? 'bg-brand-failed' : 'bg-brand-border'
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-brand-muted">Attempt {attemptCount} of 3</span>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {canRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-brand-primary px-8 py-3 text-sm font-bold text-white hover:bg-brand-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              Retry Payment
            </button>
          ) : (
            <p className="text-sm text-brand-muted">Maximum attempts reached.</p>
          )}
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-brand-border px-8 py-3 text-sm font-semibold text-brand-text hover:border-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (status === 'timeout') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-12 text-center animate-fade-in">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-brand-timeout bg-brand-timeout/10">
          <svg className="h-12 w-12 text-brand-timeout" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div tabIndex={-1} ref={headingRef}>
          <h2 className="text-2xl font-bold text-brand-timeout">Request Timed Out</h2>
          <p className="mt-2 text-sm text-brand-muted">
            The payment gateway took too long to respond.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                i <= attemptCount ? 'bg-brand-timeout' : 'bg-brand-border'
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-brand-muted">Attempt {attemptCount} of 3</span>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {canRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-brand-timeout px-8 py-3 text-sm font-bold text-white hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-timeout"
            >
              Retry Payment
            </button>
          ) : (
            <p className="text-sm text-brand-muted">Maximum attempts reached.</p>
          )}
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-brand-border px-8 py-3 text-sm font-semibold text-brand-text hover:border-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return null;
}
