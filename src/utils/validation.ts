import { FormErrors, CardDetails, CardType } from '@/types';
import { detectCardType } from './cardUtils';

export const validateCardholderName = (name: string): string | undefined => {
  if (!name.trim()) return 'Cardholder name is required';
  if (name.trim().length < 3) return 'Name must be at least 3 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name must contain only letters';
  return undefined;
};

export const validateCardNumber = (cardNumber: string): string | undefined => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!cleaned) return 'Card number is required';
  if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';

  const cardType = detectCardType(cleaned);
  const expectedLength = cardType === 'amex' ? 15 : 16;

  if (cleaned.length !== expectedLength) {
    return `Card number must be ${expectedLength} digits`;
  }
  return undefined;
};

export const validateExpiry = (expiry: string): string | undefined => {
  if (!expiry) return 'Expiry date is required';
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Use MM/YY format';

  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000;

  if (month < 1 || month > 12) return 'Invalid month';

  const now = new Date();
  const expDate = new Date(year, month - 1);
  const currentMonth = new Date(now.getFullYear(), now.getMonth());

  if (expDate < currentMonth) return 'Card has expired';
  return undefined;
};

export const validateCVV = (cvv: string, cardType: CardType): string | undefined => {
  if (!cvv) return 'CVV is required';
  const expectedLength = cardType === 'amex' ? 4 : 3;
  if (!/^\d+$/.test(cvv)) return 'CVV must contain only digits';
  if (cvv.length !== expectedLength) return `CVV must be ${expectedLength} digits`;
  return undefined;
};

export const validateAmount = (amount: string): string | undefined => {
  if (!amount) return 'Amount is required';
  const num = parseFloat(amount);
  if (isNaN(num)) return 'Enter a valid amount';
  if (num <= 0) return 'Amount must be greater than 0';
  if (num > 1000000) return 'Amount exceeds maximum limit';
  return undefined;
};

// Validate all fields and return errors object
export const validateForm = (
  cardDetails: CardDetails,
  amount: string,
  cardType: CardType
): FormErrors => {
  return {
    cardholderName: validateCardholderName(cardDetails.cardholderName),
    cardNumber: validateCardNumber(cardDetails.cardNumber),
    expiry: validateExpiry(cardDetails.expiry),
    cvv: validateCVV(cardDetails.cvv, cardType),
    amount: validateAmount(amount),
  };
};

export const isFormValid = (errors: FormErrors): boolean => {
  return Object.values(errors).every(e => e === undefined);
};