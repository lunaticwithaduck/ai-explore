import type { ReactNode } from 'react';

export type AuthPageProps = {
  children: ReactNode;
};

export function AuthPage({ children }: AuthPageProps) {
  return (
    <main className="flex w-full justify-center px-4 py-10 sm:py-16 lg:py-20">{children}</main>
  );
}
