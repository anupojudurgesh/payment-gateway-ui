import type { PaymentStatus } from '@/types';

export const TERMINAL_PAYMENT_STATUSES: ReadonlySet<PaymentStatus> = new Set([
  'success',
  'failed',
  'timeout',
]);

export function isTerminalPaymentStatus(status: PaymentStatus): boolean {
  return TERMINAL_PAYMENT_STATUSES.has(status);
}
