'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/PaymentForm';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { usePaymentStore } from '@/store/paymentStore';
import { ROUTES } from '@/constants/routes';
import { isTerminalPaymentStatus } from '@/constants/paymentFlow';

export default function PaymentPage() {
  const router = useRouter();
  const payShellRef = useRef<HTMLDivElement>(null);
  const status = usePaymentStore((s) => s.status);

  useFocusTrap(payShellRef, true);

  useEffect(() => {
    if (isTerminalPaymentStatus(status)) {
      router.replace(ROUTES.complete);
    }
  }, [status, router]);

  return (
    <div ref={payShellRef} tabIndex={-1} className="outline-none">
      <section className="glass mx-auto max-w-5xl rounded-3xl border border-brand-border p-5 shadow-xl shadow-black/10 sm:p-8">
        <PaymentForm />
      </section>
    </div>
  );
}
