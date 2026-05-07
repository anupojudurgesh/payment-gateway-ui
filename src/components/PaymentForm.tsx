'use client';

import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import type { CardDetails, CardType, Currency } from '@/types';
import { MOCK_PRODUCT, PRODUCT_OPTIONS } from '@/constants/mockProduct';
import { detectCardType, formatCardNumber, getCardMaxLength } from '@/utils/cardUtils';
import {
  validateCardholderName,
  validateCardNumber,
  validateCVV,
  validateExpiryParts,
  validateAmount,
  isFormValid,
} from '@/utils/validation';
import { usePayment } from '@/hooks/usePayment';
import { usePaymentStore } from '@/store/paymentStore';
import { formatMoney } from '@/utils/formatCurrency';
import CardPreview from './CardPreview';
import CountdownTimer from './CountdownTimer';

function InlineCardLogo({ cardType }: Readonly<{ cardType: CardType }>) {
  const srcMap: Record<Exclude<CardType, 'unknown'>, string[]> = {
    visa: ['/card-brands/visa.png', '/card-brands/Visa.png'],
    mastercard: ['/card-brands/mastercard.png', '/card-brands/Mastercard.png'],
    amex: ['/card-brands/amex.png', '/card-brands/Amex.png'],
    discover: ['/card-brands/discover.png', '/card-brands/Discover.png'],
    jcb: ['/card-brands/jcb.png', '/card-brands/Jcb.png'],
  };

  const [failedByType, setFailedByType] = useState<Partial<Record<CardType, number>>>({});

  if (cardType === 'unknown') {
    return <span className="text-xs text-brand-muted">····</span>;
  }

  const candidates = srcMap[cardType];
  const srcIndex = failedByType[cardType] ?? 0;
  const src = candidates[srcIndex];

  if (!src) {
    return <span className="text-[10px] font-semibold uppercase text-brand-muted">{cardType}</span>;
  }

  return (
    <Image
      src={src}
      alt={`${cardType} card`}
      className="h-6 w-10 object-contain"
      width={40}
      height={24}
      onError={() =>
        setFailedByType((prev) => ({
          ...prev,
          [cardType]: srcIndex + 1,
        }))
      }
    />
  );
}

function KeypadIcon() {
  const dots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <svg className="h-5 w-5 text-brand-muted" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {dots.map((i) => (
        <circle key={i} cx={4 + (i % 3) * 8} cy={4 + Math.floor(i / 3) * 8} r={2} />
      ))}
    </svg>
  );
}

export default function PaymentForm() {
  const { submitPayment, status, attemptCount } = usePayment();
  const {
    checkoutAmount,
    checkoutCurrency,
    sessionExpired,
    setSessionExpired,
    paymentTimerNonce,
    setCheckout,
    bumpPaymentTimer,
  } = usePaymentStore();

  const cardNumberRef = useRef<HTMLInputElement>(null);

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [expiryMm, setExpiryMm] = useState('');
  const [expiryYy, setExpiryYy] = useState('');
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [showItemsPopup, setShowItemsPopup] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const cardType = detectCardType(cardDetails.cardNumber);
  const currentCardNumberError = validateCardNumber(cardDetails.cardNumber);

  const validateField = useCallback(
    (name: string, value: string) => {
      switch (name) {
        case 'cardholderName': return validateCardholderName(value);
        case 'cardNumber': return validateCardNumber(value);
        case 'expiry': return validateExpiryParts(expiryMm, expiryYy);
        case 'cvv': return validateCVV(value, cardType);
        default: return undefined;
      }
    },
    [cardType, expiryMm, expiryYy]
  );

  const allErrors = {
    cardholderName: validateCardholderName(cardDetails.cardholderName),
    cardNumber: validateCardNumber(cardDetails.cardNumber),
    expiry: validateExpiryParts(expiryMm, expiryYy),
    cvv: validateCVV(cardDetails.cvv, cardType),
  };

  const amountError = validateAmount(String(checkoutAmount ?? ''));
  const formValid =
    isFormValid(allErrors) &&
    checkoutAmount !== null &&
    amountError === undefined &&
    !sessionExpired;
  const isProcessing = status === 'processing';

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value, cardType);
    setCardDetails((p) => ({ ...p, cardNumber: formatted }));
    if (touched.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
    }
  };

  const handleBlur =
    (name: string) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      setTouched((t) => ({ ...t, [name]: true }));
      const val = e.target.value;
      if (name === 'expiry') {
        setErrors((prev) => ({ ...prev, expiry: validateExpiryParts(expiryMm, expiryYy) }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
      }
    };

  const handlePayClick = async () => {
    if (checkoutAmount === null || sessionExpired || isProcessing) return;
    setTouched({ cardholderName: true, cardNumber: true, expiry: true, cvv: true });
    setErrors(allErrors);
    if (!isFormValid(allErrors)) return;
    const expiryStr = `${expiryMm.padStart(2, '0')}/${expiryYy.padStart(2, '0')}`;
    const payload: CardDetails = { ...cardDetails, expiry: expiryStr };
    await submitPayment(payload, checkoutAmount, checkoutCurrency, selectedProduct?.name);
  };

  const symbolMap: Record<Currency, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = symbolMap[checkoutCurrency];
  const selectedProduct =
    selectedProductIndex === null ? null : (PRODUCT_OPTIONS[selectedProductIndex] ?? null);
  const amountShortcuts = [1000, 5000, 10000, 25000];
  const previewExpiry =
    expiryMm.length === 2 && expiryYy.length === 2
      ? `${expiryMm}/${expiryYy}`
      : 'MM/YY';
  const dueAmountLabel =
    checkoutAmount === null ? '—' : formatMoney(checkoutAmount, checkoutCurrency);

  let payButtonContent: ReactNode;
  if (sessionExpired) {
    payButtonContent = 'Session Expired';
  } else if (isProcessing) {
    payButtonContent = (
      <span className="flex items-center justify-center gap-2">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Processing...
      </span>
    );
  } else {
    payButtonContent = `Pay ${symbol}${checkoutAmount ?? '0'}`;
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-surface px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-sm font-bold text-white">
            P
          </span>
          <span className="text-lg font-bold text-brand-text">PaySecure</span>
        </div>
        <CountdownTimer
          key={paymentTimerNonce}
          initialSeconds={120}
          onExpire={() => setSessionExpired(true)}
        />
      </div>
      {/* Main grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Left — form */}
        <div className="min-w-0 space-y-6">

          {/* Cardholder Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="cardholderName" className="text-sm font-semibold text-brand-text">
              Cardholder Name
            </label>
            <input
              id="cardholderName"
              aria-describedby={touched.cardholderName && errors.cardholderName ? 'cardholderName-error' : undefined}
              aria-invalid={!!(touched.cardholderName && errors.cardholderName)}
              disabled={sessionExpired}
              autoComplete="cc-name"
              placeholder="Jonathan Michael"
              value={cardDetails.cardholderName}
              onChange={(e) => {
                const v = e.target.value;
                setCardDetails((p) => ({ ...p, cardholderName: v }));
                if (touched.cardholderName) {
                  setErrors((prev) => ({ ...prev, cardholderName: validateCardholderName(v) }));
                }
              }}
              onBlur={handleBlur('cardholderName')}
              className={`w-full rounded-lg border bg-brand-card px-4 py-3.5 text-sm text-brand-text placeholder-brand-muted outline-none transition-all
                ${touched.cardholderName && errors.cardholderName
                  ? 'border-brand-failed focus:border-brand-failed focus:ring-2 focus:ring-brand-failed/20'
                  : 'border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
                }`}
            />
            {touched.cardholderName && errors.cardholderName && (
              <p id="cardholderName-error" role="alert" className="text-xs text-brand-failed">
                {errors.cardholderName}
              </p>
            )}
          </div>

          {/* Card Number */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="cardNumber" className="text-sm font-semibold text-brand-text">
                Card Number
              </label>
              <button
                type="button"
                onClick={() => cardNumberRef.current?.focus()}
                className="text-xs font-semibold text-brand-primary hover:text-brand-primaryHover"
              >
                ✏ Edit
              </button>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center">
                <InlineCardLogo cardType={cardType} />
              </span>
              <input
                ref={cardNumberRef}
                id="cardNumber"
                aria-describedby={touched.cardNumber && errors.cardNumber ? 'cardNumber-error' : undefined}
                aria-invalid={!!(touched.cardNumber && errors.cardNumber)}
                disabled={sessionExpired}
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={getCardMaxLength(cardType)}
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                onBlur={handleBlur('cardNumber')}
                placeholder="4242 4242 4242 4242"
                className={`w-full rounded-lg border bg-brand-card py-4 pl-12 pr-12 text-sm font-medium tracking-wide text-brand-text placeholder-brand-muted outline-none transition-all
                  ${touched.cardNumber && errors.cardNumber
                    ? 'border-brand-failed focus:border-brand-failed focus:ring-2 focus:ring-brand-failed/20'
                    : 'border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
                  }`}
              />
              {currentCardNumberError === undefined && cardType !== 'unknown' && (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-success">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
            {touched.cardNumber && errors.cardNumber && (
              <p id="cardNumber-error" role="alert" className="text-xs text-brand-failed">
                {errors.cardNumber}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* CVV */}
            <div className="flex flex-col gap-2">
              <label htmlFor="cvv" className="text-sm font-semibold text-brand-text">
                CVV Number
              </label>
              <div className="relative">
                <input
                  id="cvv"
                  aria-describedby={touched.cvv && errors.cvv ? 'cvv-error' : undefined}
                  aria-invalid={!!(touched.cvv && errors.cvv)}
                  disabled={sessionExpired}
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={cardType === 'amex' ? 4 : 3}
                  value={cardDetails.cvv}
                  onFocus={() => setIsCvvFocused(true)}
                  onBlur={(e) => {
                    setIsCvvFocused(false);
                    handleBlur('cvv')(e);
                  }}
                  onChange={(e) => {
                    const v = e.target.value.replaceAll(/\D/g, '');
                    setCardDetails((p) => ({ ...p, cvv: v }));
                    if (touched.cvv) {
                      setErrors((prev) => ({ ...prev, cvv: validateCVV(v, cardType) }));
                    }
                  }}
                  placeholder="•••"
                  className={`w-full rounded-lg border bg-brand-card py-3.5 pl-4 pr-12 text-sm font-medium text-brand-text placeholder-brand-muted outline-none transition-all
                    ${touched.cvv && errors.cvv
                      ? 'border-brand-failed focus:border-brand-failed focus:ring-2 focus:ring-brand-failed/20'
                      : 'border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
                    }`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <KeypadIcon />
                </span>
              </div>
              {touched.cvv && errors.cvv && (
                <p id="cvv-error" role="alert" className="text-xs text-brand-failed">
                  {errors.cvv}
                </p>
              )}
            </div>

            {/* Expiry */}
            <div className="flex flex-col gap-2">
              <p id="expiry-label" className="text-sm font-semibold text-brand-text">
                Expiry Date
              </p>
              <fieldset
                aria-labelledby="expiry-label"
                className="flex items-center gap-3 border-0 p-0"
              >
                <input
                  id="expiryMm"
                  aria-label="Expiry month"
                  disabled={sessionExpired}
                  inputMode="numeric"
                  maxLength={2}
                  value={expiryMm}
                  placeholder="MM"
                  onChange={(e) => {
                    const v = e.target.value.replaceAll(/\D/g, '').slice(0, 2);
                    setExpiryMm(v);
                    if (touched.expiry) {
                      setErrors((prev) => ({ ...prev, expiry: validateExpiryParts(v, expiryYy) }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, expiry: true }));
                    setErrors((prev) => ({ ...prev, expiry: validateExpiryParts(expiryMm, expiryYy) }));
                  }}
                  className={`w-20 rounded-lg border bg-brand-card px-3 py-3.5 text-center text-sm font-semibold text-brand-text placeholder-brand-muted outline-none transition-all
                    ${touched.expiry && errors.expiry
                      ? 'border-brand-failed focus:ring-2 focus:ring-brand-failed/20'
                      : 'border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
                    }`}
                />
                <span className="text-lg font-bold text-brand-muted" aria-hidden>/</span>
                <input
                  id="expiryYy"
                  aria-label="Expiry year"
                  disabled={sessionExpired}
                  inputMode="numeric"
                  maxLength={2}
                  value={expiryYy}
                  placeholder="YY"
                  onChange={(e) => {
                    const v = e.target.value.replaceAll(/\D/g, '').slice(0, 2);
                    setExpiryYy(v);
                    if (touched.expiry) {
                      setErrors((prev) => ({ ...prev, expiry: validateExpiryParts(expiryMm, v) }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, expiry: true }));
                    setErrors((prev) => ({ ...prev, expiry: validateExpiryParts(expiryMm, expiryYy) }));
                  }}
                  className={`w-20 rounded-lg border bg-brand-card px-3 py-3.5 text-center text-sm font-semibold text-brand-text placeholder-brand-muted outline-none transition-all
                    ${touched.expiry && errors.expiry
                      ? 'border-brand-failed focus:ring-2 focus:ring-brand-failed/20'
                      : 'border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
                    }`}
                />
              </fieldset>
              {touched.expiry && errors.expiry && (
                <p role="alert" className="text-xs text-brand-failed">{errors.expiry}</p>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-3 rounded-lg border border-brand-border bg-brand-card p-4">
            <div className="flex items-center justify-between">
              <label htmlFor="amount" className="text-sm font-semibold text-brand-text">
                Amount
              </label>
              <div className="flex items-center gap-2">
                {selectedProduct && (
                  <button
                    type="button"
                    disabled={sessionExpired}
                    onClick={() => {
                      setSelectedProductIndex(null);
                      setCheckout(0, checkoutCurrency);
                    }}
                    className="rounded-md border border-brand-border px-2.5 py-1 text-xs font-semibold text-brand-muted hover:border-brand-failed hover:text-brand-failed"
                  >
                    Clear
                  </button>
                )}
                <div className="relative">
                  <button
                    type="button"
                    disabled={sessionExpired}
                    onClick={() => setShowItemsPopup((prev) => !prev)}
                    className="rounded-md border border-brand-border px-2.5 py-1 text-xs font-semibold text-brand-text hover:border-brand-primary"
                  >
                    Items
                  </button>
                {showItemsPopup && (
                  <div className="absolute right-0 top-9 z-20 w-56 rounded-md border border-brand-border bg-brand-surface p-2 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductIndex(null);
                        setCheckout(0, checkoutCurrency);
                        setShowItemsPopup(false);
                      }}
                      className="mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-semibold text-brand-muted hover:bg-brand-card"
                    >
                      <span>No item selected</span>
                      <span>₹0</span>
                    </button>
                    {PRODUCT_OPTIONS.map((product, index) => (
                      <button
                        key={product.orderNumber}
                        type="button"
                        onClick={() => {
                          const total = product.price + product.tax;
                          setSelectedProductIndex(index);
                          setCheckout(total, checkoutCurrency);
                          setShowItemsPopup(false);
                        }}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-brand-text hover:bg-brand-card"
                      >
                        <span className="truncate">{product.name}</span>
                        <span className="ml-2 text-brand-muted">{formatMoney(product.price + product.tax, checkoutCurrency)}</span>
                      </button>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_110px] gap-2">
              <input
                id="amount"
                type="number"
                min={1}
                step="0.01"
                disabled={sessionExpired}
                value={checkoutAmount ?? ''}
                onChange={(e) => {
                  const next = Number.parseFloat(e.target.value);
                  setCheckout(Number.isNaN(next) ? 0 : next, checkoutCurrency);
                }}
                className="rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm font-semibold text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
              <select
                id="currency"
                value={checkoutCurrency}
                disabled={sessionExpired}
                onChange={(e) => {
                  const currency = e.target.value as Currency;
                  setCheckout(checkoutAmount ?? 0, currency);
                }}
                className="rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {amountShortcuts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  disabled={sessionExpired}
                  onClick={() => setCheckout(amount, checkoutCurrency)}
                  className="rounded-md border border-brand-border px-2.5 py-1 text-xs font-medium text-brand-muted hover:border-brand-primary hover:text-brand-text"
                >
                  {formatMoney(amount, checkoutCurrency)}
                </button>
              ))}
            </div>

            {amountError && <p className="text-xs text-brand-failed">{amountError}</p>}
            {selectedProduct && (
              <p className="text-xs text-brand-muted">
                Selected: <span className="font-semibold text-brand-text">{selectedProduct.name}</span> ·{' '}
                <span className="font-semibold text-brand-text">{dueAmountLabel}</span>
              </p>
            )}
          </div>

          {/* Attempt counter */}
          {attemptCount > 0 && (
            <p className="text-center text-sm text-brand-muted">
              Attempt{' '}
              <span className="font-semibold text-brand-text">{attemptCount}</span>
              {' '}of{' '}
              <span className="font-semibold text-brand-text">3</span>
            </p>
          )}

          {/* Pay button */}
          <button
            type="button"
            onClick={handlePayClick}
            disabled={!formValid || isProcessing || sessionExpired}
            aria-disabled={!formValid || isProcessing || sessionExpired}
            className={`w-full rounded-lg py-4 text-base font-bold text-white shadow-md transition-all
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary
              disabled:cursor-not-allowed disabled:opacity-50
              ${formValid && !isProcessing && !sessionExpired
                ? 'bg-brand-primary hover:bg-brand-primaryHover'
                : 'bg-brand-border'
              }`}
          >
            {payButtonContent}
          </button>

          <p className="text-center text-xs text-brand-muted">
            By continuing, you agree to process this payment securely.
          </p>
        </div>

        {/* Right — card preview + summary */}
        <div className="min-w-0 space-y-6">
          <CardPreview
            cardholderName={cardDetails.cardholderName}
            cardNumber={cardDetails.cardNumber}
            expiry={previewExpiry}
            cvv={cardDetails.cvv}
            cardType={cardType}
            isFlipped={isCvvFocused}
          />

          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              Order Summary
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-brand-muted">Company</dt>
                <dd className="font-semibold text-brand-text">
                  {MOCK_PRODUCT.companyLogo} {MOCK_PRODUCT.company}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-brand-muted">Product</dt>
                <dd className="text-right font-semibold text-brand-text">
                  {selectedProduct?.name ?? 'Not selected'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-brand-muted">Tax (18%)</dt>
                <dd className="font-semibold text-brand-text">
                  {formatMoney(selectedProduct?.tax ?? 0, checkoutCurrency)}
                </dd>
              </div>
            </dl>
            <div className="my-4 border-t border-dashed border-brand-border" />
            <div>
              <p className="text-xs text-brand-muted">You have to Pay</p>
              <p className="text-2xl font-bold text-brand-text">{dueAmountLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {sessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl border border-brand-failed/50 bg-brand-surface p-6 text-center shadow-2xl">
            <h3 className="text-lg font-bold text-brand-failed">Session Expired</h3>
            <p className="mt-2 text-sm text-brand-muted">
              Your payment session has expired. Start a new 2-minute session to continue.
            </p>
            <button
              type="button"
              onClick={() => {
                setSessionExpired(false);
                bumpPaymentTimer();
              }}
              className="mt-5 w-full rounded-md bg-brand-failed px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Retry Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}