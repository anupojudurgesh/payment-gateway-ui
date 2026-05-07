import { CardType } from '@/types';

const stripSpaces = (value: string) => value.replaceAll(/\s/g, '');

// Detect card type from IIN/BIN ranges.
export const detectCardType = (cardNumber: string): CardType => {
  const cleaned = stripSpaces(cardNumber);

  if (cleaned.startsWith('4')) {
    return 'visa';
  }
  if (cleaned.startsWith('34') || cleaned.startsWith('37')) {
    return 'amex';
  }
  if (cleaned.startsWith('6011')) {
    return 'discover';
  }
  if (cleaned.startsWith('35')) {
    return 'jcb';
  }
  if (cleaned.length >= 2 && cleaned.startsWith('5')) {
    const firstTwo = Number.parseInt(cleaned.slice(0, 2), 10);
    if (firstTwo >= 51 && firstTwo <= 55) {
      return 'mastercard';
    }
  }
  if (cleaned.length >= 4 && cleaned.startsWith('2')) {
    const prefix = Number.parseInt(cleaned.slice(0, 4), 10);
    if (prefix >= 2221 && prefix <= 2720) {
      return 'mastercard';
    }
  }
  return 'unknown';
};

// Format card number with spaces every 4 digits
// Amex format: 4-6-5 (e.g. 3782 822463 10005)
export const formatCardNumber = (value: string, cardType: CardType): string => {
  const cleaned = value.replaceAll(/\D/g, '');

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
  const cleaned = stripSpaces(cardNumber);
  if (cleaned.length === 0) return '•••• •••• •••• ••••';

  const masked = cleaned.padEnd(16, '•');
  return [
    masked.slice(0, 4),
    masked.slice(4, 8),
    masked.slice(8, 12),
    masked.slice(12, 16),
  ].join(' ');
};