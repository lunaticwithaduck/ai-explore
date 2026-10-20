import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { isAuthRoute } from '../utils/nextParam';
import { useAppLocale } from './useAppLocale';
import { useCurrentProfile } from './useCurrentProfile';
import { useCurrentUser } from './useCurrentUser';

export function useProfileLocaleSync() {
  const { status, user } = useCurrentUser();
  const { profile } = useCurrentProfile();
  const locale = useAppLocale();
  const pathname = usePathname();
  const router = useRouter();
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'signedOut') syncedFor.current = null;
    if (!user || !profile || syncedFor.current === user.uid || isAuthRoute(pathname)) return;
    syncedFor.current = user.uid;
    if (profile.locale !== locale) {
      router.replace(`${pathname}${window.location.search}`, { locale: profile.locale });
    }
  }, [status, user, profile, locale, pathname, router]);
}
