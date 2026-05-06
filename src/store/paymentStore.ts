import { create } from 'zustand';
import { PaymentStatus, Transaction, Currency } from '@/types';
import { loadHistory, saveHistory } from '@/utils/storage';

interface PaymentStore {
  // State
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  transactionHistory: Transaction[];
  attemptCount: number;
  selectedTransaction: Transaction | null;

  // Actions
  startPayment: (transaction: Transaction) => void;
  setStatus: (status: PaymentStatus) => void;
  setSuccess: (transactionId: string) => void;
  setFailed: (transactionId: string, reason: string) => void;
  setTimeout: (transactionId: string) => void;
  retryPayment: () => void;
  resetPayment: () => void;
  selectTransaction: (transaction: Transaction | null) => void;
  loadPersistedHistory: () => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  // Initial state
  status: 'idle',
  currentTransaction: null,
  transactionHistory: [],
  attemptCount: 0,
  selectedTransaction: null,

  // Called when user hits Pay — creates the transaction entry
  startPayment: (transaction) => {
    const history = get().transactionHistory;
    const exists = history.find(t => t.id === transaction.id);

    // If this transactionId already exists (retry), update it — don't duplicate
    const updatedHistory = exists
      ? history.map(t => t.id === transaction.id ? { ...t, status: 'processing' as PaymentStatus } : t)
      : [transaction, ...history];

    saveHistory(updatedHistory);
    set({
      status: 'processing',
      currentTransaction: transaction,
      transactionHistory: updatedHistory,
      attemptCount: get().attemptCount + 1,
    });
  },

  setStatus: (status) => set({ status }),

  setSuccess: (transactionId) => {
    const history = get().transactionHistory.map(t =>
      t.id === transactionId
        ? { ...t, status: 'success' as PaymentStatus, attemptCount: get().attemptCount }
        : t
    );
    saveHistory(history);
    set({ status: 'success', transactionHistory: history });
  },

  setFailed: (transactionId, reason) => {
    const history = get().transactionHistory.map(t =>
      t.id === transactionId
        ? { ...t, status: 'failed' as PaymentStatus, failureReason: reason, attemptCount: get().attemptCount }
        : t
    );
    saveHistory(history);
    set({ status: 'failed', transactionHistory: history });
  },

  setTimeout: (transactionId) => {
    const history = get().transactionHistory.map(t =>
      t.id === transactionId
        ? { ...t, status: 'timeout' as PaymentStatus, attemptCount: get().attemptCount }
        : t
    );
    saveHistory(history);
    set({ status: 'timeout', transactionHistory: history });
  },

  // Retry — keeps same transactionId, just resets status to idle
  retryPayment: () => set({ status: 'idle' }),

  // Full reset — new payment, new transactionId will be generated
  resetPayment: () => set({
    status: 'idle',
    currentTransaction: null,
    attemptCount: 0,
  }),

  selectTransaction: (transaction) => set({ selectedTransaction: transaction }),

  // Load history from localStorage on app mount
  loadPersistedHistory: () => {
    const history = loadHistory();
    set({ transactionHistory: history });
  },
}));