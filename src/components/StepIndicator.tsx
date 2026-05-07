'use client';

import type { Step } from '@/types';

const STEPS: { id: Step; label: string }[] = [
  { id: 'order', label: 'Overview' },
  { id: 'payment', label: 'Payment' },
  { id: 'result', label: 'Complete' },
];

interface StepIndicatorProps {
  currentStep: Step;
}

function stepIndex(step: Step): number {
  return STEPS.findIndex((s) => s.id === step);
}

export default function StepIndicator({ currentStep }: Readonly<StepIndicatorProps>) {
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
                  active ? 'scale-105 opacity-100' : 'opacity-70'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                    completed
                      ? 'border-brand-success bg-brand-success/20 text-brand-success'
                      : active
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-brand-border text-brand-muted'
                  }`}
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
                  className={`hidden h-0.5 w-8 rounded sm:block md:w-14 ${
                    index < activeIndex ? 'bg-brand-success' : 'bg-brand-border'
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
