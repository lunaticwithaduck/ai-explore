import { useMemo } from 'react';
import type { ReviewDoc } from '@/api/endpoints/reviews';
import { useAppLocale } from '@/features/auth/hooks/useAppLocale';
import type { ReviewFormValues } from '../config/schemas';
import { createReview, deleteReview, type ReviewAuthor, updateReview } from '../utils/reviewBatch';
import { useBatchAction } from './useBatchAction';

export function useReviewWrites(toolId: string) {
  const locale = useAppLocale();
  const { run, pending, error, clearError } = useBatchAction();

  const writes = useMemo(
    () => ({
      create: (author: ReviewAuthor, values: ReviewFormValues) =>
        run((db) => createReview(db, toolId, author, { ...values, locale })),
      update: (review: ReviewDoc, values: ReviewFormValues) =>
        run((db) => updateReview(db, toolId, review.authorUid, review.rating, values)),
      remove: (review: ReviewDoc) =>
        run((db) => deleteReview(db, toolId, review.authorUid, review.rating)),
    }),
    [run, toolId, locale],
  );

  return { ...writes, pending, error, clearError };
}
