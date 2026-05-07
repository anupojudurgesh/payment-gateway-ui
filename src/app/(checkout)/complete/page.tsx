'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import StatusScreen from '@/components/StatusScreen';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { usePayment } from '@/hooks/usePayment';
import { ROUTES } from '@/constants/routes';
import { isTerminalPaymentStatus } from '@/constants/paymentFlow';

export default function CompletePage() {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const { status, currentTransaction, attemptCount, canRetry, handleRetry, handleReset } =
    usePayment();

  useFocusTrap(resultRef, true);

  useEffect(() => {
    if (!isTerminalPaymentStatus(status)) {
      router.replace(ROUTES.overview);
    }
  }, [status, router]);

  const onRetry = () => {
    handleRetry();
    router.push(ROUTES.overview);
  };

  const onReset = () => {
    handleReset();
    router.push(ROUTES.payment);
  };

  if (!isTerminalPaymentStatus(status)) {
    return null;
  }

  return (
    <div
      ref={resultRef}
      tabIndex={-1}
      className="glass mx-auto max-w-5xl rounded-3xl border border-brand-border p-6 shadow-xl shadow-black/10 outline-none sm:p-10"
    >
      <StatusScreen
        status={status}
        transaction={currentTransaction}
        attemptCount={attemptCount}
        canRetry={canRetry}
        onRetry={onRetry}
        onReset={onReset}
      />
    </div>
  );
}
