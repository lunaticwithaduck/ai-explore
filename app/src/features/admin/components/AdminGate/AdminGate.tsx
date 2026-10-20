import type { ReactNode } from 'react';

export type AdminGateProps = {
  children: ReactNode;
};

export function AdminGate({ children }: AdminGateProps) {
  return children;
}
