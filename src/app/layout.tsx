import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { THEME_STORAGE_KEY } from '@/utils/storage';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Payment Gateway',
  description: 'Secure payment gateway built with Next.js and TypeScript',
};

const themeBlockingScript = `
(function(){
  try {
    var v = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (v === 'light') {
      document.documentElement.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('theme-dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-dark" suppressHydrationWarning>
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeBlockingScript }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
