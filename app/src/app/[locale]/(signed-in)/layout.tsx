import type { ReactNode } from 'react';
import { AuthGate } from '@/shell/AuthGate/AuthGate';

type SignedInLayoutProps = {
  children: ReactNode;
};

export default function SignedInLayout({ children }: SignedInLayoutProps) {
  return <AuthGate>{children}</AuthGate>;
}
