export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'unknown';

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type Step = 'order' | 'payment' | 'result';

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface PaymentPayload {
  transactionId: string;
  cardDetails: CardDetails;
  amount: number;
  currency: Currency;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: string;
  failureReason?: string;
  attemptCount: number;
  productName?: string;
}

export interface FormErrors {
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  amount?: string;
}

export interface Product {
  name: string;
  company: string;
  companyLogo: string;
  orderNumber: string;
  price: number;
  tax: number;
  currency: Currency;
  image: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'success' | 'failed';
  failureReason?: string;
}
