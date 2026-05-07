'use client';

import { useEffect } from 'react';
import type { Transaction } from '@/types';
import { usePaymentStore } from '@/store/paymentStore';
import { formatMoney } from '@/utils/formatCurrency';
import { formatRelativeTime } from '@/utils/relativeTime';

const StatusBadge = ({ status }: Readonly<{ status: Transaction['status'] }>) => {
  const config = {
    success: 'border-brand-success/40 bg-brand-success/15 text-brand-success',
    failed: 'border-brand-failed/40 bg-brand-failed/15 text-brand-failed',
    timeout: 'border-brand-timeout/40 bg-brand-timeout/15 text-brand-timeout',
    processing: 'border-brand-primary/40 bg-brand-primary/15 text-brand-primary',
    idle: 'border-brand-border bg-brand-card text-brand-muted',
  };

  const labelMap: Record<Transaction['status'], string> = {
    success: 'Success',
    failed: 'Failed',
    timeout: 'Timeout',
    processing: 'Processing',
    idle: 'Idle',
  };
  const label = labelMap[status];

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${config[status]}`}
    >
      {label}
    </span>
  );
};

export default function TransactionHistory() {
  const { transactionHistory, selectedTransaction, selectTransaction, loadPersistedHistory } =
    usePaymentStore();

  useEffect(() => {
    loadPersistedHistory();
  }, [loadPersistedHistory]);

  if (transactionHistory.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 py-10">
        <svg
          className="h-16 w-16 text-brand-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.25}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-center text-sm text-brand-muted">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="flex max-h-[calc(100vh-64px)] flex-col overflow-hidden">
      <div className="overflow-y-auto">
        {transactionHistory.map((tx) => (
          <button
            key={tx.id}
            type="button"
            onClick={() => selectTransaction(selectedTransaction?.id === tx.id ? null : tx)}
            className={`w-full cursor-pointer border-b border-white/5 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary ${
              selectedTransaction?.id === tx.id ? 'bg-white/[0.06]' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-brand-muted">#{tx.id.slice(0, 8)}</span>
              <StatusBadge status={tx.status} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-brand-text">
                {formatMoney(tx.amount, tx.currency)}
              </span>
              <span className="text-xs text-brand-muted">{formatRelativeTime(tx.timestamp)}</span>
            </div>
            {selectedTransaction?.id === tx.id && (
              <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-xs animate-fade-in">
                <div className="flex justify-between gap-3">
                  <span className="text-brand-muted">Full ID</span>
                  <span className="max-w-[65%] break-all text-right font-mono text-brand-text">
                    {tx.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Attempts</span>
                  <span className="text-brand-text">{tx.attemptCount}</span>
                </div>
                {tx.failureReason && (
                  <div className="flex justify-between gap-3">
                    <span className="text-brand-muted">Reason</span>
                    <span className="text-right text-brand-failed">{tx.failureReason}</span>
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
