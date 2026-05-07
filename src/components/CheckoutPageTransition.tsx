'use client';

import { Suspense, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

function routeEnterClass(pathname: string | null): string {
  if (!pathname) return '';
  if (pathname === ROUTES.payment || pathname === ROUTES.complete) {
    return 'animate-checkout-route motion-reduce:animate-none motion-reduce:opacity-100';
  }
  return '';
}

function TransitionInner({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className={routeEnterClass(pathname)}>
      {children}
    </div>
  );
}

/** Entrance motion when navigating into payment or complete (overview stays unwrapped to avoid double motion). */
export default function CheckoutPageTransition({ children }: { readonly children: ReactNode }) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <TransitionInner>{children}</TransitionInner>
    </Suspense>
  );
}
