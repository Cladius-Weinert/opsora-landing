import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  // Marketing pages are public, no auth needed
  return <>{children}</>;
}