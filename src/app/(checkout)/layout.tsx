import CheckoutShell from '@/components/CheckoutShell';

export default function CheckoutLayout({ children }: { readonly children: React.ReactNode }) {
  return <CheckoutShell>{children}</CheckoutShell>;
}
