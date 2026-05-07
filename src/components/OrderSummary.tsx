'use client';

import { usePaymentStore } from '@/store/paymentStore';

export default function OrderSummary() {
  const { setStep } = usePaymentStore();

  const handleProceed = () => {
    setStep('payment');
  };

  return (
    <section className="animate-slide-up mx-auto max-w-5xl rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-xl shadow-black/10 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="inline-flex rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
            Secure Payment Gateway
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            Fast, secure checkout experience
          </h1>
          <p className="mt-3 text-sm leading-6 text-brand-muted">
            Complete payments with real-time validation, transaction tracking, and robust retry handling
            for failed or timed-out requests.
          </p>
          <button
            type="button"
            onClick={handleProceed}
            className="mt-6 rounded-md bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:bg-brand-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Start Payment
          </button>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-card p-5">
          <h2 className="text-sm font-semibold text-brand-text">Workflow & Edge Cases Covered</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-muted">
            <li>- Real-time form validation with card type and expiry checks</li>
            <li>- Processing, success, failed, and timeout lifecycle states</li>
            <li>- 6-second frontend abort handling for slow responses</li>
            <li>- Retry flow with max 3 attempts and stable transaction ID</li>
            <li>- Persistent transaction history with expandable details</li>
          </ul>
        </div>
      </div>
    </section>
  );
}