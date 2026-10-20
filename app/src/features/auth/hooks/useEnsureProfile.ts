import { useEffect, useRef } from 'react';
import { useEnsureProfileMutation } from '@/api/endpoints/profile';
import { deriveDisplayName, safePhotoUrl } from '../utils/profileSeed';
import { useAppLocale } from './useAppLocale';
import { useCurrentProfile } from './useCurrentProfile';
import { useCurrentUser } from './useCurrentUser';

export function useEnsureProfile() {
  const { user } = useCurrentUser();
  const { profile, isLoaded } = useCurrentProfile();
  const locale = useAppLocale();
  const [ensureProfile] = useEnsureProfileMutation();
  const attemptedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !isLoaded || profile !== null || attemptedFor.current === user.uid) return;
    attemptedFor.current = user.uid;
    void ensureProfile({
      uid: user.uid,
      displayName: deriveDisplayName(user),
      photoUrl: safePhotoUrl(user.photoUrl),
      locale,
    });
  }, [user, isLoaded, profile, locale, ensureProfile]);
}
