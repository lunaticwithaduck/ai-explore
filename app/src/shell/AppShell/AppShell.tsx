import type { ReactNode } from 'react';

export type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return children;
}
