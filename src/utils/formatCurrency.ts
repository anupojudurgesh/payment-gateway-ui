import type { Currency } from '@/types';

export function formatMoney(amount: number, currency: Currency): string {
  const localeMap: Record<Currency, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'en-IE',
    GBP: 'en-GB',
  };
  const maxFractionDigits = currency === 'INR' ? 0 : 2;

  return new Intl.NumberFormat(localeMap[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: maxFractionDigits,
  }).format(amount);
}
