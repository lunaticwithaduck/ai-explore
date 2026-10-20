'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { ReviewDoc } from '@/api/endpoints/reviews';
import type { ReviewFormValues } from '../../config/schemas';
import { OwnReviewActions } from '../OwnReviewActions/OwnReviewActions';
import { ReviewForm } from '../ReviewForm/ReviewForm';
import { ReviewItem } from '../ReviewItem/ReviewItem';
import { ownReviewStyles as styles } from './OwnReview.styles';

export type OwnReviewProps = {
  toolId: string;
  review: ReviewDoc;
  pending: boolean;
  onUpdate: (values: ReviewFormValues) => Promise<boolean>;
  onDelete: () => void;
};

export function OwnReview({ toolId, review, pending, onUpdate, onDelete }: OwnReviewProps) {
  const t = useTranslations('reviews.form');
  const [editing, setEditing] = useState(false);

  if (editing)
    return (
      <ReviewForm
        title={t('editTitle')}
        submitLabel={t('update')}
        initialValues={{ rating: review.rating, body: review.body }}
        pending={pending}
        onCancel={() => setEditing(false)}
        onSubmit={async (values) => {
          if (await onUpdate(values)) setEditing(false);
        }}
      />
    );

  return (
    <div className={styles.root}>
      <ReviewItem
        toolId={toolId}
        review={review}
        viewerUid={review.authorUid}
        actions={
          <OwnReviewActions
            disabled={pending}
            onEdit={() => setEditing(true)}
            onDelete={onDelete}
          />
        }
      />
    </div>
  );
}
