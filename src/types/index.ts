// What type of card the user is holding
export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

// Every possible state the payment can be in
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

// Supported currencies
export type Currency = 'INR' | 'USD';

// Raw card details from the form
export interface CardDetails {
  cardholderName: string;
  cardNumber: number;
  expiry: string;
  cvv: number;
}

// What we send to the API
export interface PaymentPayload {
  transactionId: string;
  cardDetails: CardDetails;
  amount: number;
  currency: Currency;
}

// What gets stored in transaction history
export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: string;
  failureReason?: string;
  attemptCount: number;
}

// Per-field form validation errors
export interface FormErrors {
  cardholderName?: string;
  cardNumber?: number;
  expiry?: string;
  cvv?: number;
  amount?: string;
}

// What the API returns
export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'success' | 'failed';
  failureReason?: string;
}