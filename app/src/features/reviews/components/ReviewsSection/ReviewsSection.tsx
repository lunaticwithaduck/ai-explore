'use client';

import { Card, Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useId, useMemo, useState } from 'react';
import { useToolReviewsQuery } from '@/api/endpoints/reviews';
import { TEST_IDS } from '@/config/test-ids';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { DEFAULT_REVIEW_SORT, type ReviewSort } from '../../config/constants';
import { errorCode } from '../../utils/errorCode';
import { splitOwnReview } from '../../utils/sortReviews';
import { RatingSummary } from '../RatingSummary/RatingSummary';
import { ReviewComposer } from '../ReviewComposer/ReviewComposer';
import { ReviewList } from '../ReviewList/ReviewList';
import { ReviewListSkeleton } from '../ReviewListSkeleton/ReviewListSkeleton';
import { reviewsSectionStyles as styles } from './ReviewsSection.styles';

export type ReviewsSectionProps = {
  toolId: string;
};

export function ReviewsSection({ toolId }: ReviewsSectionProps) {
  const t = useTranslations('reviews');
  const tErrors = useTranslations('errors');
  const headingId = useId();
  const { status, user } = useCurrentUser();
  const viewerUid = status === 'signedIn' && user ? user.uid : null;
  const [sort, setSort] = useState<ReviewSort>(DEFAULT_REVIEW_SORT);
  const { currentData: reviews, error } = useToolReviewsQuery(toolId);
  const { own, others } = useMemo(
    () => splitOwnReview(reviews ?? [], viewerUid, sort),
    [reviews, viewerUid, sort],
  );

  return (
    <Card asChild padding="none">
      <section
        aria-labelledby={headingId}
        className={styles.root}
        data-testid={TEST_IDS.reviews.section}
      >
        <div className={styles.header}>
          <Heading level={2} id={headingId}>
            {t('title')}
          </Heading>
          <RatingSummary toolId={toolId} />
        </div>
        <ReviewComposer
          toolId={toolId}
          own={reviews === undefined ? undefined : own}
          failed={Boolean(error)}
        />
        {reviews === undefined && !error && <ReviewListSkeleton label={t('loading')} />}
        {reviews === undefined && error && (
          <Text size="sm" tone="danger" role="alert">
            {tErrors(errorCode(error))}
          </Text>
        )}
        {reviews?.length === 0 && (
          <Text size="sm" tone="subtle">
            {t('list.empty')}
          </Text>
        )}
        <ReviewList
          toolId={toolId}
          reviews={others}
          viewerUid={viewerUid}
          sort={sort}
          onSortChange={setSort}
        />
      </section>
    </Card>
  );
}
