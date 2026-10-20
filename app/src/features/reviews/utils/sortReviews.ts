import type { ReviewDoc } from '@/api/endpoints/reviews';
import { REVIEW_SORTS, type ReviewSort } from '../config/constants';

const byNewest = (a: ReviewDoc, b: ReviewDoc) => b.createdAt.getTime() - a.createdAt.getTime();

const byHelpful = (a: ReviewDoc, b: ReviewDoc) => b.helpfulCount - a.helpfulCount || byNewest(a, b);

export function sortReviews(reviews: readonly ReviewDoc[], sort: ReviewSort): ReviewDoc[] {
  return [...reviews].sort(sort === 'helpful' ? byHelpful : byNewest);
}

export type SplitReviews = {
  own: ReviewDoc | null;
  others: ReviewDoc[];
};

export function splitOwnReview(
  reviews: readonly ReviewDoc[],
  uid: string | null,
  sort: ReviewSort,
): SplitReviews {
  const own = uid ? (reviews.find((review) => review.authorUid === uid) ?? null) : null;
  return {
    own,
    others: sortReviews(own ? reviews.filter((review) => review !== own) : reviews, sort),
  };
}

export const isReviewSort = (value: string): value is ReviewSort =>
  (REVIEW_SORTS as readonly string[]).includes(value);
