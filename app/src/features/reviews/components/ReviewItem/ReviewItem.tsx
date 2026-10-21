'use client';

import { Avatar, Badge, StarRating, Text } from '@ai-explore/ui';
import { useFormatter, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { ReviewDoc } from '@/api/endpoints/reviews';
import { TEST_IDS } from '@/config/test-ids';
import { initials } from '@/features/auth/utils/initials';
import { isEdited } from '../../utils/isEdited';
import { HelpfulButton } from '../HelpfulButton/HelpfulButton';
import { reviewItemStyles as styles } from './ReviewItem.styles';

export type ReviewItemProps = {
  toolId: string;
  review: ReviewDoc;
  viewerUid: string | null;
  actions?: ReactNode;
};

export function ReviewItem({ toolId, review, viewerUid, actions }: ReviewItemProps) {
  const t = useTranslations('reviews.item');
  const format = useFormatter();
  const own = viewerUid === review.authorUid;

  return (
    <article className={styles.root} data-testid={TEST_IDS.reviews.item} data-id={review.authorUid}>
      <div className={styles.header}>
        <Avatar
          aria-hidden
          src={review.authorPhotoUrl}
          alt={review.authorName}
          fallback={initials(review.authorName)}
        />
        <div className={styles.meta}>
          <div className={styles.nameRow}>
            <Text as="span" className={styles.name}>
              {review.authorName}
            </Text>
            <StarRating
              size="sm"
              value={review.rating}
              label={t('ratingLabel', { rating: review.rating })}
            />
            {own && (
              <Badge tone="accent" size="sm">
                {t('yours')}
              </Badge>
            )}
          </div>
          <div className={styles.detailRow}>
            <Text as="span" size="sm" tone="muted">
              <time dateTime={review.createdAt.toISOString()}>
                {format.dateTime(review.createdAt, { dateStyle: 'medium' })}
              </time>
            </Text>
            {isEdited(review) && (
              <>
                <span aria-hidden className={styles.separator} />
                <Text as="span" size="sm" tone="muted">
                  {t('edited')}
                </Text>
              </>
            )}
          </div>
        </div>
      </div>
      {review.body && (
        <Text tone="muted" className={styles.body}>
          {review.body}
        </Text>
      )}
      <div className={styles.footer}>
        <HelpfulButton toolId={toolId} review={review} viewerUid={viewerUid} />
        {actions}
      </div>
    </article>
  );
}
