'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CardType } from '@/types';
import { maskCardNumber } from '@/utils/cardUtils';

interface CardPreviewProps {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardType: CardType;
  isFlipped: boolean;
}

const CardNetworkLogo = ({ cardType }: Readonly<{ cardType: CardType }>) => {
  const srcMap: Record<Exclude<CardType, 'unknown'>, string[]> = {
    visa: ['/card-brands/visa.png', '/card-brands/Visa.png'],
    mastercard: ['/card-brands/mastercard.png', '/card-brands/Mastercard.png'],
    amex: ['/card-brands/amex.png', '/card-brands/Amex.png'],
    discover: ['/card-brands/discover.png', '/card-brands/Discover.png'],
    jcb: ['/card-brands/jcb.png', '/card-brands/Jcb.png'],
  };
  const [failedByType, setFailedByType] = useState<Partial<Record<CardType, number>>>({});

  if (cardType === 'unknown') {
    return null;
  }
  const sources = srcMap[cardType];
  const srcIndex = failedByType[cardType] ?? 0;
  const src = sources[srcIndex];

  if (!src) {
    return (
      <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
        {cardType}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${cardType} logo`}
      className="h-10 w-16 object-contain"
      width={64}
      height={40}
      onError={() =>
        setFailedByType((prev) => ({
          ...prev,
          [cardType]: srcIndex + 1,
        }))
      }
    />
  );
};

function ContactlessIcon() {
  return (
    <svg
      className="h-7 w-7 rotate-90 text-white/80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeWidth={1.5}
        strokeLinecap="round"
        d="M8 12c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5-1.5 3.5-4 3.5-4-1.5-4-3.5z"
      />
      <path strokeWidth={1.5} strokeLinecap="round" d="M10 12h4" />
      <path strokeWidth={1.5} strokeLinecap="round" d="M12 10v4" />
    </svg>
  );
}

const ChipIcon = () => (
  <div
    className="relative flex h-[28px] w-10 items-center justify-center rounded-md bg-linear-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-inner"
    aria-hidden
  >
    <div className="grid h-[18px] w-[26px] grid-cols-3 grid-rows-3 gap-px p-0.5">
      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].map((k) => (
        <div key={k} className="rounded-[1px] bg-amber-900/35" />
      ))}
    </div>
  </div>
);

const cardBgMap: Record<CardType, string> = {
  visa: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
  mastercard: 'linear-gradient(135deg, #1a0a0a, #2d1515, #8b0000)',
  amex: 'linear-gradient(135deg, #0a1628, #1a3a5c, #2d6a9f)',
  discover: 'linear-gradient(135deg, #1a1a2e, #2d2d44, #3d3d5c)',
  jcb: 'linear-gradient(135deg, #1a1a2e, #2d2d44, #3d3d5c)',
  unknown: 'linear-gradient(135deg, #1a1a2e, #2d2d44, #3d3d5c)',
};

export default function CardPreview({
  cardholderName,
  cardNumber,
  expiry,
  cvv,
  cardType,
  isFlipped,
}: Readonly<CardPreviewProps>) {
  const displayName = (cardholderName || 'FULL NAME').toUpperCase();

  return (
    <div className="card-scene w-full">
      <div className="relative aspect-[380/240] w-full">
        <div className={`card-body absolute inset-0 ${isFlipped ? 'flipped' : ''}`}>
          <div
            className="card-front absolute inset-0 flex flex-col justify-between rounded-2xl p-6 shadow-2xl ring-1 ring-white/10"
            style={{ background: cardBgMap[cardType] }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.12]"
              style={{
                background:
                  'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.35) 0%, transparent 55%)',
              }}
            />
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <ChipIcon />
                <ContactlessIcon />
              </div>
              <div className="flex min-h-10 min-w-16 items-center justify-end">
                <CardNetworkLogo cardType={cardType} />
              </div>
            </div>

            <div className="relative z-10 font-mono text-[18px] tracking-[0.2em] text-white">
              {maskCardNumber(cardNumber)}
            </div>

            <div className="relative z-10 flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Card Holder</p>
                <p className="truncate text-sm font-semibold uppercase tracking-[0.1em] text-white">
                  {displayName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/50">Valid Thru</p>
                <p className="font-mono text-sm font-semibold text-white">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>

          <div
            className="card-back absolute inset-0 flex flex-col justify-center rounded-2xl shadow-2xl ring-1 ring-white/10"
            style={{ background: cardBgMap[cardType] }}
          >
            <div className="h-12 w-full bg-black/80" />
            <div className="mx-6 mt-8">
              <div className="flex items-center justify-end rounded bg-white/95 px-4 py-2">
                <span className="font-mono text-sm tracking-widest text-slate-800">
                  {cvv ? cvv.replaceAll(/./g, '•') : '•••'}
                </span>
              </div>
              <p className="mt-2 text-right text-[10px] uppercase tracking-wider text-white/45">
                CVV
              </p>
            </div>
            <div className="absolute bottom-5 right-6">
              <div className="flex min-h-10 min-w-16 items-center justify-end">
                <CardNetworkLogo cardType={cardType} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
