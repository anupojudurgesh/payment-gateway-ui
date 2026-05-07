import type { Product } from '@/types';

export const PRODUCT_OPTIONS: Product[] = [
  {
    name: 'MacBook Air M3',
    company: 'Apple',
    companyLogo: '🍎',
    orderNumber: '#ORD-2847391',
    price: 92900,
    tax: 18590,
    currency: 'INR',
    image: '💻',
  },
  {
    name: 'iPhone 15',
    company: 'Apple',
    companyLogo: '🍎',
    orderNumber: '#ORD-2847392',
    price: 79900,
    tax: 14382,
    currency: 'INR',
    image: '📱',
  },
  {
    name: 'AirPods Pro',
    company: 'Apple',
    companyLogo: '🍎',
    orderNumber: '#ORD-2847393',
    price: 24900,
    tax: 4482,
    currency: 'INR',
    image: '🎧',
  },
];

export const MOCK_PRODUCT: Product = {
  ...PRODUCT_OPTIONS[0],
};
