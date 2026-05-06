import { CardType } from '@/types';

// Detect card type from first digits
export const detectCardType = (cardNumber: string): CardType => {
  const cleaned = cardNumber.replace(/\s/g, '');

  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  return 'unknown';
};

// Format card number with spaces every 4 digits
// Amex format: 4-6-5 (e.g. 3782 822463 10005)
export const formatCardNumber = (value: string, cardType: CardType): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cardType === 'amex') {
    const parts = [
      cleaned.slice(0, 4),
      cleaned.slice(4, 10),
      cleaned.slice(10, 15),
    ];
    return parts.filter(Boolean).join(' ');
  }

  // Visa / Mastercard: 4-4-4-4
  const parts = [
    cleaned.slice(0, 4),
    cleaned.slice(4, 8),
    cleaned.slice(8, 12),
    cleaned.slice(12, 16),
  ];
  return parts.filter(Boolean).join(' ');
};

// Max card number length (with spaces)
export const getCardMaxLength = (cardType: CardType): number => {
  return cardType === 'amex' ? 17 : 19;
};

// Mask card number for preview display
export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length === 0) return '•••• •••• •••• ••••';

  const masked = cleaned.padEnd(16, '•');
  return [
    masked.slice(0, 4),
    masked.slice(4, 8),
    masked.slice(8, 12),
    masked.slice(12, 16),
  ].join(' ');
};