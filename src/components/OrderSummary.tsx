'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

/** Opacity starts inside keyframes (fill backwards); avoid a static opacity-0 utility overriding the animation. */
const reveal = 'animate-overview-in motion-reduce:animate-none motion-reduce:opacity-100';

function ArrowUpRight(props: Readonly<{ className?: string }>) {
  return (
    <svg
      className={props.className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4.5 19.5 19.5 4.5M19.5 4.5H9M19.5 4.5v10.5" />
    </svg>
  );
}

export default function OrderSummary() {
  const router = useRouter();

  return (
    <section className="relative mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
        {/* Glow + copy */}
        <div className="relative isolate max-w-5xl min-w-0 flex-1 overflow-hidden py-1">
          <div
            className="pointer-events-none absolute left-[12%] top-[10%] h-28 w-28 rounded-full bg-brand-primary/[0.09] blur-2xl motion-reduce:hidden sm:h-32 sm:w-32"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-[28%] right-[8%] h-24 w-24 rounded-full bg-brand-primary/[0.06] blur-xl motion-reduce:hidden sm:h-28 sm:w-28"
            aria-hidden
          />

          <header className="relative z-10 space-y-8">
            <p className={`flex items-center gap-3 text-sm text-brand-muted ${reveal}`}>
              <span className="h-px w-10 bg-gradient-to-r from-brand-primary/70 to-transparent" aria-hidden />
              Checkout demo
            </p>
            <h1
              className={`text-balance font-semibold tracking-tight text-brand-text text-[clamp(2.125rem,4.5vw,3.25rem)] leading-[1.12] ${reveal} [animation-delay:75ms]`}
            >
              Walk through checkout like it&apos;s live.
              <span className="mt-3 block max-w-5xl text-[clamp(1.125rem,2.2vw,1.5rem)] font-normal leading-snug text-brand-muted">
                Nothing hits a real processor — only this app and a mock{' '}
                <code className="rounded-md bg-brand-card px-1.5 py-1 font-mono text-[0.85em] text-brand-text/90 ring-1 ring-brand-border/80">
                  /api/pay
                </code>{' '}
                route that can succeed, fail, or stall on purpose.
              </span>
            </h1>
            <div
              className={`max-w-5xl space-y-4 text-[15px] leading-relaxed text-brand-muted ${reveal} [animation-delay:150ms]`}
            >
              <p>
                Nothing here touches a real processor. You type card details, pick an amount, and the app
                calls a tiny API that randomly says yes, no, or keeps you waiting until the browser gives
                up (about six seconds).
              </p>
              <p>
                Validators run as you type — spacing on the number, expiry shape, CVV length, and a Luhn
                check so obviously wrong cards never leave the page.
              </p>
              <p>
                If the charge fails or times out, you can try again up to three times on the same attempt.
                Past runs sit in the history drawer if you want to compare outcomes.
              </p>
            </div>
          </header>
        </div>

        {/* CTA — right column, aligned with hero / glow */}
        <div
          className={`flex shrink-0 flex-col items-end gap-3 self-start lg:max-w-[220px] lg:pt-10 ${reveal} [animation-delay:290ms]`}
        >
          <ArrowUpRight className="text-brand-primary/85 motion-reduce:opacity-90" />
          <button
            type="button"
            onClick={() => router.push(ROUTES.payment)}
            className="inline-flex w-full min-w-[11rem] items-center justify-center rounded-xl bg-brand-primary px-10 py-4 text-base font-semibold text-white shadow-lg shadow-brand-primary/30 ring-1 ring-white/10 transition-all duration-200 hover:bg-brand-primaryHover hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:w-auto"
          >
            Go to payment
          </button>
          <p className="max-w-[14rem] text-right text-sm leading-snug text-brand-muted">
            Next screen: card form, amount, and submit.
          </p>
        </div>
      </div>

      <div className={`relative z-10 mt-12 max-w-5xl border-t border-brand-border/70 pt-12 ${reveal} [animation-delay:330ms]`}>
        <p className="text-[15px] leading-relaxed text-brand-muted">
          There&apos;s also a simple session timer on the payment screen; when it hits zero you&apos;ll
          need to start fresh. That&apos;s deliberate — it&apos;s annoying on purpose, same as in real
          checkouts.
        </p>
      </div>

      <p
        className={`relative z-10 mt-20 text-xs leading-relaxed text-brand-muted/70 ${reveal} [animation-delay:400ms]`}
      >
        Stack is Next.js (App Router), TypeScript, Zustand, and Tailwind. Mock POST handler:{' '}
        <code className="rounded-md bg-brand-card px-1.5 py-1 font-mono text-[11px] text-brand-text/90 ring-1 ring-brand-border/60">
          /api/pay
        </code>
      </p>
    </section>
  );
}
