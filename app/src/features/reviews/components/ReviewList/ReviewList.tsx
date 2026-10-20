'use client';

import { SegmentedControl } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import type { ReviewDoc } from '@/api/endpoints/reviews';
import { REVIEW_SORTS, type ReviewSort } from '../../config/constants';
import { isReviewSort } from '../../utils/sortReviews';
import { ReviewItem } from '../ReviewItem/ReviewItem';
import { reviewListStyles as styles } from './ReviewList.styles';

export type ReviewListProps = {
  toolId: string;
  reviews: readonly ReviewDoc[];
  viewerUid: string | null;
  sort: ReviewSort;
  onSortChange: (sort: ReviewSort) => void;
};

export function ReviewList({ toolId, reviews, viewerUid, sort, onSortChange }: ReviewListProps) {
  const t = useTranslations('reviews.list');
  if (reviews.length === 0) return null;
  const options = REVIEW_SORTS.map((value) => ({ value, label: t(`sort.${value}`) }));

  return (
    <div className={styles.root}>
      {reviews.length > 1 && (
        <div className={styles.toolbar}>
          <SegmentedControl
            size="sm"
            options={options}
            value={sort}
            label={t('sortLabel')}
            onValueChange={(value) => {
              if (isReviewSort(value)) onSortChange(value);
            }}
          />
        </div>
      )}
      <ul className={styles.list}>
        {reviews.map((review) => (
          <li key={review.id} className={styles.item}>
            <ReviewItem toolId={toolId} review={review} viewerUid={viewerUid} />
          </li>
        ))}
      </ul>
    </div>
  );
}
