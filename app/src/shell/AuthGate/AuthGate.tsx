'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { routes } from '@/config/routes';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { signInHref } from '@/features/auth/utils/nextParam';
import { usePathname, useRouter } from '@/i18n/navigation';
import { GateSkeleton } from '../GateSkeleton/GateSkeleton';

export type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const { status } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const wasSignedIn = useRef(false);

  useEffect(() => {
    if (status === 'signedIn') wasSignedIn.current = true;
    if (status !== 'signedOut') return;
    router.replace(
      wasSignedIn.current ? routes.library : signInHref(`${pathname}${window.location.search}`),
    );
  }, [status, pathname, router]);

  return status === 'signedIn' ? children : <GateSkeleton />;
}
