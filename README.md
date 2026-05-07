# Payment Gateway UI (Next.js + TypeScript)

A mock payment gateway built with Next.js App Router and TypeScript.
The app simulates real-world payment flow behavior without third-party payment SDKs.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Zustand (global payment state)
- Tailwind CSS v4

## Features Implemented

- Three-step flow: **Order Review** → **Payment** (with session countdown) → **Result** (`success` / `failed` / `timeout`)
- Step indicator and dark glassmorphism UI with Tailwind animations (`slide-up`, `fade-in`, `pulse-glow`, etc.)
- Real-time validated payment form:
  - Cardholder name
  - Card number with auto-format
  - Expiry (`MM/YY`) with past date rejection
  - CVV (3 digits, or 4 for Amex)
  - Amount + currency selector (`INR`, `USD`)
- Card type detection and badge (Visa, Mastercard, Amex)
- Live card preview (number, name, expiry, CVV-side flip on focus)
- Payment lifecycle states:
  - `idle`, `processing`, `success`, `failed`, `timeout`
- Mock gateway at `POST /api/pay`:
  - Success: ~60%
  - Failure: ~25% (returns reason)
  - Delayed timeout behavior: ~15% (8s response)
- Frontend timeout using `AbortController` at 6 seconds
- Retry flow with max 3 attempts and visible attempt counter
- Idempotent retries with a stable transaction ID (`crypto.randomUUID()`)
- Transaction history:
  - ID, amount, status, timestamp
  - Expandable details
  - Persisted in `localStorage`

## Project Structure

```text
src/
  app/
    api/pay/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    CardInput.tsx
    CardPreview.tsx
    CountdownTimer.tsx
    OrderSummary.tsx
    PaymentForm.tsx
    StatusScreen.tsx
    StepIndicator.tsx
    TransactionHistory.tsx
  constants/
    mockProduct.ts
  hooks/
    usePayment.ts
  store/
    paymentStore.ts
  types/
    index.ts
  utils/
    cardUtils.ts
    formatCurrency.ts
    relativeTime.ts
    storage.ts
    validation.ts
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run start` - run production build
- `npm run lint` - run lint checks

## Assumptions

- The gateway outcome distribution is simulated probabilistically and not deterministic.
- Timeout UX is handled on the frontend through abort logic; the backend still completes delayed requests.
- Transaction history is intentionally local to the browser via `localStorage`.

## What I Would Improve Next

- Add unit tests for validation and card formatting utilities.
- Add integration tests for payment lifecycle and retry edge cases.
- Improve keyboard accessibility patterns in interactive history rows.
- Add analytics hooks for conversion and failure-rate insights.
- Add currency formatting utilities per locale.
