'use client';

import { useAuthSubscription } from '../../hooks/useAuthSubscription';
import { useEnsureProfile } from '../../hooks/useEnsureProfile';
import { useProfileLocaleSync } from '../../hooks/useProfileLocaleSync';

export function AuthListener() {
  useAuthSubscription();
  useEnsureProfile();
  useProfileLocaleSync();
  return null;
}
