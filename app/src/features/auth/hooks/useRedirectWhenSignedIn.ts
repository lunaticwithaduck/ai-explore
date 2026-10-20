import { useEffect } from 'react';
import { routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { useCurrentUser } from './useCurrentUser';
import { useNextParam } from './useNextParam';

export function useRedirectWhenSignedIn(busy: boolean) {
  const { status } = useCurrentUser();
  const next = useNextParam();
  const router = useRouter();

  useEffect(() => {
    if (status === 'signedIn' && !busy) router.replace(next ?? routes.library);
  }, [status, busy, next, router]);
}
