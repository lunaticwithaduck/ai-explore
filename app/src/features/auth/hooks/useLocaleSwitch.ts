import { useCallback } from 'react';
import { useUpdateProfileMutation } from '@/api/endpoints/profile';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { useAppLocale } from './useAppLocale';
import { useCurrentProfile } from './useCurrentProfile';
import { useCurrentUser } from './useCurrentUser';

export function useLocaleSwitch(): (next: Locale) => void {
  const { user } = useCurrentUser();
  const { profile } = useCurrentProfile();
  const current = useAppLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [updateProfile] = useUpdateProfileMutation();

  return useCallback(
    (next: Locale) => {
      if (user && profile?.locale !== next) {
        void updateProfile({ uid: user.uid, patch: { locale: next } });
      }
      if (next !== current) {
        router.replace(`${pathname}${window.location.search}`, { locale: next });
      }
    },
    [user, profile, current, pathname, router, updateProfile],
  );
}
