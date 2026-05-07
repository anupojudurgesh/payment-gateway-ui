# 💳 PaySecure – Modern Payment Gateway UI

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-yellow?style=for-the-badge)

**PaySecure** is a robust, accessible, and production-ready mock payment gateway built with Next.js App Router and TypeScript. It simulates real-world payment flows—including probabilistic gateway outcomes, timeouts, retries, and session expiry—without relying on any third-party SDKs like Stripe or Razorpay.

## ✨ Core Features

### 🛡️ Real-World Form Validation
* **Per-field, Real-time Validation:** Validates card numbers (Luhn algorithm), rejects past expiry dates, and dynamically expects 3 or 4 digit CVVs depending on the card brand.
* **Auto-Formatting & Detection:** Automatically formats card numbers with spaces (4-4-4-4 or 4-6-5 for Amex) and displays the corresponding brand badge (Visa, Mastercard, Amex, Discover, JCB) dynamically.
* **Interactive Card Preview:** A live, 3D-flipping card preview that updates securely as the user types.

### 🔄 Resilient Payment Lifecycle
* **Mock Gateway (API Route):** A built-in `/api/pay` endpoint that authentically simulates network conditions: 
  * `60%` Success rate
  * `25%` Failure rate (with realistic rejection reasons like 'Insufficient funds')
  * `15%` Timeout rate (deliberately delayed for 8 seconds)
* **AbortController Integration:** The frontend gracefully aborts the connection if the gateway takes longer than 6 seconds, transitioning smoothly to a "Timeout" state.
* **Idempotency & Retries:** Generates a secure, unique `transactionId` (`crypto.randomUUID()`) on the client. Retries (capped at a maximum of 3 attempts) reuse this ID to prevent duplicate processing.

### ♿ Enterprise-Grade Accessibility (A11y)
* **Focus Management:** Focus is programmatically trapped and restored when navigating through Modals and Route changes (e.g., the Transaction History panel traps tab-focus and closes on `Escape`).
* **ARIA Compliant:** Inputs utilize `aria-describedby` to natively link error texts to screen readers.
* **Responsive & Themeable:** Fully responsive across mobile (375px) and desktop (1280px) with seamless Light/Dark mode toggling.

---

## 🏗️ Project Architecture

```text
src/
├── app/                  # Next.js App Router (Layouts, Pages, API)
│   ├── (checkout)/       # Main checkout flow
│   └── api/pay/          # Mock Serverless Gateway Logic
├── components/           # Modular UI Components (CardInput, StatusScreen, etc.)
├── constants/            # Mock Data configurations
├── hooks/                # Custom React Hooks (e.g., usePayment)
├── store/                # Zustand State Management (paymentStore)
├── types/                # Strict TypeScript Definitions
└── utils/                # Pure Functions (Validation, formatting, idempotency)
```

### Why Zustand over Redux?
Zustand was chosen for state management to avoid the boilerplate of Redux while maintaining a strictly typed, immutable store. It excellently handles the global payment lifecycle (`idle`, `processing`, `success`, `failed`, `timeout`) and persists our transaction history safely to `localStorage`.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v20+) and `npm` installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Development
Start the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

### 4. Production Build
This app is fully optimized and ready to deploy to Vercel, Netlify, or your preferred hosting provider.
```bash
npm run build
npm run start
```

---

## 🧪 Testing the Flows

To test the specific gateway behaviours, simply submit the form multiple times. The outcomes are randomized server-side:
1. **Success:** You will see a confetti animation, a success checkmark, and the transaction ID will be populated in your history.
2. **Failure:** The UI will shake, display a failure reason, and offer a "Retry" button. You can attempt up to 3 times before being locked out.
3. **Timeout:** You will experience a deliberate 6-second wait, followed by an elegant abort/timeout screen.

---

## 🔮 Future Improvements

If given more time, the following enhancements would be added:
1. **Automated Testing:** Implement unit tests for `validation.ts` and `cardUtils.ts` using Vitest, and end-to-end (E2E) integration tests using Playwright.
2. **Native i18n Currency Formatting:** Swap the hardcoded currency map with `Intl.NumberFormat` to format amounts natively based on the user's browser locale.
3. **Telemetry & Analytics:** Add hooks to capture conversion funnels and track failure-rate insights.

---
*Designed & built with focus on clean architecture and impeccable UX.*
