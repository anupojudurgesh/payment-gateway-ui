import { useCallback, useRef } from 'react';
import { usePaymentStore } from '@/store/paymentStore';
import type { CardDetails, Currency, Transaction } from '@/types';

const TIMEOUT_MS = 6000;

export const usePayment = () => {
  const {
    status,
    currentTransaction,
    attemptCount,
    startPayment,
    setSuccess,
    setFailed,
    setTimeout: setTimeoutStatus,
    retryPayment,
    resetPayment,
    sessionExpired,
  } = usePaymentStore();

  const transactionIdRef = useRef<string | null>(null);

  const submitPayment = useCallback(
    async (cardDetails: CardDetails, amount: number, currency: Currency, productName?: string) => {
      if (!transactionIdRef.current) {
        transactionIdRef.current = crypto.randomUUID();
      }

      const transactionId = transactionIdRef.current;

      const transaction: Transaction = {
        id: transactionId,
        amount,
        currency,
        status: 'processing',
        timestamp: new Date().toISOString(),
        attemptCount: attemptCount + 1,
        productName,
      };

      startPayment(transaction);

      const controller = new AbortController();
      const timeoutId = globalThis.setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId,
            cardDetails,
            amount,
            currency,
          }),
          signal: controller.signal,
        });

        globalThis.clearTimeout(timeoutId);

        if (!response.ok) {
          setFailed(transactionId, 'Payment request failed. Please try again.');
          return;
        }

        const data = (await response.json()) as {
          status: string;
          failureReason?: string;
        };

        if (data.status === 'success') {
          setSuccess(transactionId);
        } else {
          setFailed(transactionId, data.failureReason || 'Payment failed');
        }
      } catch (error) {
        globalThis.clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
          setTimeoutStatus(transactionId);
        } else {
          setFailed(transactionId, 'Network error. Please check your connection.');
        }
      }
    },
    [attemptCount, startPayment, setSuccess, setFailed, setTimeoutStatus]
  );

  const handleRetry = useCallback(() => {
    retryPayment();
  }, [retryPayment]);

  const handleReset = useCallback(() => {
    transactionIdRef.current = null;
    resetPayment();
  }, [resetPayment]);

  return {
    status,
    currentTransaction,
    attemptCount,
    submitPayment,
    handleRetry,
    handleReset,
    canRetry: !sessionExpired && attemptCount < 3 && (status === 'failed' || status === 'timeout'),
  };
};
