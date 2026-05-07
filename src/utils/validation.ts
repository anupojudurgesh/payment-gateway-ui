import { FormErrors, CardDetails, CardType } from '@/types';
import { detectCardType } from './cardUtils';

export const validateCardholderName = (name: string): string | undefined => {
  if (!name.trim()) return 'Cardholder name is required';
  if (name.trim().length < 3) return 'Name must be at least 3 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name must contain only letters';
  return undefined;
};

export const validateCardNumber = (cardNumber: string): string | undefined => {
  const cleaned = cardNumber.replaceAll(/\s/g, '');
  if (!cleaned) return 'Card number is required';
  if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';

  const cardType = detectCardType(cleaned);
  const patternMap = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6011[0-9]{12}$/,
    jcb: /^35[0-9]{14}$/,
    unknown: /^\d{13,19}$/,
  } as const;

  if (!patternMap[cardType].test(cleaned)) {
    return 'Card number format is invalid';
  }

  let checksum = 0;
  let doubleDigit = false;
  for (let i = cleaned.length - 1; i >= 0; i -= 1) {
    const digit = Number.parseInt(cleaned[i] ?? '0', 10);
    if (doubleDigit) {
      const doubled = digit * 2;
      checksum += doubled > 9 ? doubled - 9 : doubled;
    } else {
      checksum += digit;
    }
    doubleDigit = !doubleDigit;
  }
  if (checksum % 10 !== 0) {
    return 'Card number is invalid';
  }

  return undefined;
};

export const validateExpiryParts = (mm: string, yy: string): string | undefined => {
  if (!mm.trim() || !yy.trim()) return 'Expiry date is required';
  if (mm.length !== 2 || yy.length !== 2) return 'Enter MM and YY (2 digits each)';
  const month = mm.padStart(2, '0');
  const year = yy.padStart(2, '0');
  return validateExpiry(`${month}/${year}`);
};

export const validateExpiry = (expiry: string): string | undefined => {
  if (!expiry) return 'Expiry date is required';
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Use MM/YY format';

  const [monthStr, yearStr] = expiry.split('/');
  const month = Number.parseInt(monthStr, 10);
  const year = Number.parseInt(yearStr, 10) + 2000;

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
  const num = Number.parseFloat(amount);
  if (Number.isNaN(num)) return 'Enter a valid amount';
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