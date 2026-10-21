'use client';

import { Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import type { ReviewDoc } from '@/api/endpoints/reviews';
import { useCurrentProfile } from '@/features/auth/hooks/useCurrentProfile';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useReviewAuthor } from '../../hooks/useReviewAuthor';
import { useReviewWrites } from '../../hooks/useReviewWrites';
import { OwnReview } from '../OwnReview/OwnReview';
import { ReviewForm } from '../ReviewForm/ReviewForm';
import { ReviewSignInPrompt } from '../ReviewSignInPrompt/ReviewSignInPrompt';
import { reviewComposerStyles as styles } from './ReviewComposer.styles';

export type ReviewComposerProps = {
  toolId: string;
  own: ReviewDoc | null | undefined;
  failed?: boolean;
};

export function ReviewComposer({ toolId, own, failed = false }: ReviewComposerProps) {
  const t = useTranslations('reviews.form');
  const tErrors = useTranslations('errors');
  const { status } = useCurrentUser();
  const { profile, isLoaded } = useCurrentProfile();
  const author = useReviewAuthor();
  const writes = useReviewWrites(toolId);
  const profileMissing = isLoaded && profile === null;

  if (status === 'signedOut') return <ReviewSignInPrompt />;
  if (own === undefined && failed) return null;
  if (own === undefined || (!own && !author && !profileMissing))
    return <Skeleton shape="card" className={styles.loading} />;

  return (
    <div className={styles.root}>
      {writes.error && (
        <Text size="sm" tone="danger" role="alert">
          {tErrors(writes.error)}
        </Text>
      )}
      {own && (
        <OwnReview
          toolId={toolId}
          review={own}
          pending={writes.pending}
          onUpdate={(values) => writes.update(own, values)}
          onDelete={() => void writes.remove(own)}
        />
      )}
      {!own && author && (
        <ReviewForm
          title={t('createTitle')}
          submitLabel={t('submit')}
          pending={writes.pending}
          onSubmit={(values) => writes.create(author, values)}
        />
      )}
      {!own && !author && (
        <Text size="sm" tone="muted" role="status" className={styles.profileMissing}>
          {t('profileMissing')}
        </Text>
      )}
    </div>
  );
}
