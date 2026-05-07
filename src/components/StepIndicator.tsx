'use client';

import { usePathname } from 'next/navigation';
import type { Step } from '@/types';

const STEPS: { id: Step; label: string }[] = [
  { id: 'order', label: 'Overview' },
  { id: 'payment', label: 'Payment' },
  { id: 'result', label: 'Complete' },
];

function pathnameToStep(pathname: string): Step {
  if (pathname === '/payment' || pathname.startsWith('/payment/')) {
    return 'payment';
  }
  if (pathname === '/complete' || pathname.startsWith('/complete/')) {
    return 'result';
  }
  return 'order';
}

function stepIndex(step: Step): number {
  return STEPS.findIndex((s) => s.id === step);
}

function stepCircleClass(completed: boolean, active: boolean): string {
  if (completed) {
    return 'border-brand-success bg-brand-success/15 text-brand-success';
  }
  if (active) {
    return 'border-brand-primary bg-brand-primary text-white shadow-md shadow-brand-primary/35';
  }
  return 'border-brand-border bg-transparent text-brand-muted';
}

export default function StepIndicator() {
  const pathname = usePathname();
  const currentStep = pathnameToStep(pathname ?? '/');
  const activeIndex = stepIndex(currentStep);

  return (
    <nav aria-label="Checkout progress" className="flex-1">
      <ol className="flex flex-wrap items-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const completed = index < activeIndex;
          const active = index === activeIndex;

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-4">
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${
                  active ? 'scale-105 opacity-100' : 'opacity-80'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${stepCircleClass(completed, active)}`}
                  aria-current={active ? 'step' : undefined}
                >
                  {completed ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`hidden text-sm font-semibold sm:inline ${
                    active ? 'text-brand-text' : 'text-brand-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`hidden h-px w-8 rounded-full sm:block md:w-14 ${
                    index < activeIndex ? 'bg-brand-success/60' : 'bg-brand-border'
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
