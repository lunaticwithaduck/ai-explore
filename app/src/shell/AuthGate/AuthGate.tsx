import type { ReactNode } from 'react';

export type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  return children;
}
