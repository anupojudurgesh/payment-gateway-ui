'use client';

import { useEffect, useRef, useState } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
  onExpire: () => void;
}

function DigitBox({
  digit,
  urgent,
}: Readonly<{ digit: string; urgent: boolean }>) {
  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl font-bold shadow-inner transition-colors ${
        urgent
          ? 'border-brand-failed/45 bg-brand-failed/15 text-brand-failed'
          : 'border-brand-border bg-brand-card text-brand-text'
      }`}
    >
      {digit}
    </span>
  );
}

export default function CountdownTimer({
  initialSeconds = 120,
  onExpire,
}: Readonly<CountdownTimerProps>) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const id = globalThis.setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => globalThis.clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining === 0 && !triggeredRef.current) {
      triggeredRef.current = true;
      onExpire();
    }
  }, [remaining, onExpire]);

  const expired = remaining === 0;
  const urgent = remaining < 30 && !expired;
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  if (expired) {
    return (
      <output className="text-sm font-semibold text-brand-failed">
        Session Expired
      </output>
    );
  }

  return (
    <div className="flex items-center gap-1" aria-live="polite" aria-atomic="true">
      <DigitBox digit={mm[0] ?? '0'} urgent={urgent} />
      <DigitBox digit={mm[1] ?? '0'} urgent={urgent} />
      <span className={`px-0.5 text-xl font-bold ${urgent ? 'text-brand-failed' : 'text-brand-text'}`}>:</span>
      <DigitBox digit={ss[0] ?? '0'} urgent={urgent} />
      <DigitBox digit={ss[1] ?? '0'} urgent={urgent} />
    </div>
  );
}
