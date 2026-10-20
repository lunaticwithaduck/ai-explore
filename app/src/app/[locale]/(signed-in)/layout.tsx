import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NOINDEX } from '@/lib/seo/metadata';
import { AuthGate } from '@/shell/AuthGate/AuthGate';

export const metadata: Metadata = { robots: NOINDEX };

type SignedInLayoutProps = {
  children: ReactNode;
};

export default function SignedInLayout({ children }: SignedInLayoutProps) {
  return <AuthGate>{children}</AuthGate>;
}
