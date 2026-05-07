import { create } from 'zustand';
import type { PaymentStatus, Transaction, Currency, Step } from '@/types';
import { loadHistory, saveHistory } from '@/utils/storage';

interface PaymentStore {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  transactionHistory: Transaction[];
  attemptCount: number;
  selectedTransaction: Transaction | null;
  currentStep: Step;
  sessionExpired: boolean;
  checkoutAmount: number | null;
  checkoutCurrency: Currency;
  paymentTimerNonce: number;
  historyPanelOpen: boolean;

  setStep: (step: Step) => void;
  bumpPaymentTimer: () => void;
  setCheckout: (amount: number, currency: Currency) => void;
  setSessionExpired: (expired: boolean) => void;
  startPayment: (transaction: Transaction) => void;
  setStatus: (status: PaymentStatus) => void;
  setSuccess: (transactionId: string) => void;
  setFailed: (transactionId: string, reason: string) => void;
  setTimeout: (transactionId: string) => void;
  retryPayment: () => void;
  resetPayment: () => void;
  selectTransaction: (transaction: Transaction | null) => void;
  loadPersistedHistory: () => void;
  setHistoryPanelOpen: (open: boolean) => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  status: 'idle',
  currentTransaction: null,
  transactionHistory: [],
  attemptCount: 0,
  selectedTransaction: null,
  currentStep: 'order',
  sessionExpired: false,
  checkoutAmount: 0,
  checkoutCurrency: 'INR',
  paymentTimerNonce: 0,
  historyPanelOpen: false,
  setHistoryPanelOpen: (open) => set({ historyPanelOpen: open }),


  setStep: (step) => set({ currentStep: step }),

  bumpPaymentTimer: () =>
    set((s) => ({ paymentTimerNonce: s.paymentTimerNonce + 1 })),

  setCheckout: (amount, currency) =>
    set({ checkoutAmount: amount, checkoutCurrency: currency }),

  setSessionExpired: (expired) => set({ sessionExpired: expired }),

  startPayment: (transaction) => {
    const history = get().transactionHistory;
    const exists = history.find((t) => t.id === transaction.id);

    const updatedHistory = exists
      ? history.map((t) =>
          t.id === transaction.id ? { ...t, status: 'processing' as PaymentStatus } : t
        )
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
    const history = get().transactionHistory.map((t) =>
      t.id === transactionId
        ? { ...t, status: 'success' as PaymentStatus, attemptCount: get().attemptCount }
        : t
    );
    saveHistory(history);
    set({ status: 'success', transactionHistory: history, currentStep: 'result' });
  },

  setFailed: (transactionId, reason) => {
    const history = get().transactionHistory.map((t) =>
      t.id === transactionId
        ? {
            ...t,
            status: 'failed' as PaymentStatus,
            failureReason: reason,
            attemptCount: get().attemptCount,
          }
        : t
    );
    saveHistory(history);
    set({ status: 'failed', transactionHistory: history, currentStep: 'result' });
  },

  setTimeout: (transactionId) => {
    const history = get().transactionHistory.map((t) =>
      t.id === transactionId
        ? { ...t, status: 'timeout' as PaymentStatus, attemptCount: get().attemptCount }
        : t
    );
    saveHistory(history);
    set({ status: 'timeout', transactionHistory: history, currentStep: 'result' });
  },

  retryPayment: () =>
    set((s) => ({
      status: 'idle',
      currentStep: 'order',
      sessionExpired: false,
      paymentTimerNonce: s.paymentTimerNonce + 1,
    })),

  resetPayment: () =>
    set({
      status: 'idle',
      currentTransaction: null,
      attemptCount: 0,
      selectedTransaction: null,
      currentStep: 'payment',
      sessionExpired: false,
      checkoutAmount: 0,
      checkoutCurrency: 'INR',
      paymentTimerNonce: 0,
      historyPanelOpen: false,
    }),

  selectTransaction: (transaction) => set({ selectedTransaction: transaction }),

  loadPersistedHistory: () => {
    const history = loadHistory();
    set({ transactionHistory: history });
  },
}));
