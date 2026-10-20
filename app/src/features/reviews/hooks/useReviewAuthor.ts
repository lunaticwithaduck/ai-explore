import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useCurrentProfile } from '@/features/auth/hooks/useCurrentProfile';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { reviewAuthor } from '../utils/reviewAuthor';
import type { ReviewAuthor } from '../utils/reviewBatch';

export function useReviewAuthor(): ReviewAuthor | null {
  const t = useTranslations('reviews');
  const { status, user } = useCurrentUser();
  const { profile } = useCurrentProfile();
  const fallbackName = t('anonymous');
  return useMemo(
    () => (status === 'signedIn' && user ? reviewAuthor(user, profile, fallbackName) : null),
    [status, user, profile, fallbackName],
  );
}
