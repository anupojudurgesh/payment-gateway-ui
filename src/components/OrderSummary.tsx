'use client';

import { startTransition } from 'react';
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
              SoleLab assessment piece
            </p>
            <h1
              className={`text-balance font-semibold tracking-tight text-brand-text text-[clamp(2.125rem,4.5vw,3.25rem)] leading-[1.12] ${reveal} [animation-delay:75ms]`}
            >
              Here&apos;s the checkout flow we put together.
              <span className="mt-3 block max-w-5xl text-[clamp(1.125rem,2.2vw,1.5rem)] font-normal leading-snug text-brand-muted">
                No Stripe-style SDK — just a Next.js app, strict TypeScript, and a small{' '}
                <code className="rounded-md bg-brand-card px-1.5 py-1 font-mono text-[0.85em] text-brand-text/90 ring-1 ring-brand-border/80">
                  /api/pay
                </code>{' '}
                handler that fakes success, failure, or a slow response so we could exercise loading,
                errors, and timeouts without touching real money.
              </span>
            </h1>
            <div
              className={`max-w-5xl space-y-4 text-[15px] leading-relaxed text-brand-muted ${reveal} [animation-delay:150ms]`}
            >
              <p>
                We split the experience into three routes — overview, payment, result — so the URL matches
                where you are in the flow. State lives in Zustand (including a running history written to{' '}
                <code className="rounded bg-brand-card px-1 py-0.5 font-mono text-[13px] text-brand-text/90">
                  localStorage
                </code>
                ). On the payment screen we format the PAN as you type, guess card brand from the BIN-ish
                prefix, validate expiry/CVV, run Luhn, then POST with{' '}
                <code className="rounded bg-brand-card px-1 py-0.5 font-mono text-[13px] text-brand-text/90">
                  AbortSignal
                </code>{' '}
                so the client drops the call around six seconds. Same transaction id (
                <code className="rounded bg-brand-card px-1 py-0.5 font-mono text-[13px] text-brand-text/90">
                  crypto.randomUUID()
                </code>
                ) on retries, capped at three attempts if something&apos;s still wrong.
              </p>
              <p>
                Light/dark follows your saved preference with a tiny inline script so the page doesn&apos;t
                flash the wrong theme on refresh. Beyond that it&apos;s mostly layout, forms, and handling
                awkward states — which is most of what we wanted to show.
              </p>
              <p>
                If you&apos;re reviewing this: thanks for reading the boring bits. Use the history drawer
                anytime to line up past tries; the rest is clicking through like a normal checkout.
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
            onClick={() => startTransition(() => router.push(ROUTES.payment))}
            className="inline-flex w-full min-w-[11rem] items-center justify-center rounded-xl bg-brand-primary px-10 py-4 text-base font-semibold text-white shadow-lg shadow-brand-primary/30 ring-1 ring-white/10 transition-all duration-200 hover:bg-brand-primaryHover hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:w-auto"
          >
            Go to payment
          </button>
          <p className="max-w-[14rem] text-right text-sm leading-snug text-brand-muted">
            Opens the payment route — form, amount, then submit.
          </p>
        </div>
      </div>

      <div className={`relative z-10 mt-12 max-w-5xl border-t border-brand-border/70 pt-12 ${reveal} [animation-delay:330ms]`}>
        <p className="text-[15px] leading-relaxed text-brand-muted">
          We also wired a short session countdown on the payment step. When it expires you get a modal and
          have to restart — not fun, but it mirrors the &quot;your session timed out&quot; headache you see
          in production carts.
        </p>
      </div>

      <p
        className={`relative z-10 mt-20 text-xs leading-relaxed text-brand-muted/70 ${reveal} [animation-delay:400ms]`}
      >
        Built with Next.js (App Router), TypeScript, Zustand, Tailwind; mock charge endpoint at{' '}
        <code className="rounded-md bg-brand-card px-1.5 py-1 font-mono text-[11px] text-brand-text/90 ring-1 ring-brand-border/60">
          /api/pay
        </code>
        .
      </p>
    </section>
  );
}
