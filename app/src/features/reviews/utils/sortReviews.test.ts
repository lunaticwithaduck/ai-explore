import { describe, expect, it } from 'vitest';
import type { ReviewDoc } from '@/api/endpoints/reviews';
import { isReviewSort, sortReviews, splitOwnReview } from './sortReviews';

const review = (authorUid: string, daysAgo: number, helpfulCount: number): ReviewDoc => {
  const at = new Date(Date.UTC(2026, 9, 20 - daysAgo));
  return {
    id: authorUid,
    toolId: 'jasper',
    authorUid,
    rating: 4,
    body: '',
    authorName: authorUid,
    authorPhotoUrl: null,
    locale: 'en',
    helpfulCount,
    createdAt: at,
    updatedAt: at,
  };
};

const reviews = [review('old-popular', 9, 40), review('new', 1, 0), review('mid', 4, 40)];
const ids = (list: readonly ReviewDoc[]) => list.map((item) => item.id);

describe('sortReviews', () => {
  it('puts the newest first', () => {
    expect(ids(sortReviews(reviews, 'newest'))).toEqual(['new', 'mid', 'old-popular']);
  });

  it('puts the most helpful first and breaks ties by date', () => {
    expect(ids(sortReviews(reviews, 'helpful'))).toEqual(['mid', 'old-popular', 'new']);
  });

  it('leaves the input untouched', () => {
    sortReviews(reviews, 'helpful');
    expect(ids(reviews)).toEqual(['old-popular', 'new', 'mid']);
  });
});

describe('splitOwnReview', () => {
  it('pulls the viewer review out of the sorted rest', () => {
    const { own, others } = splitOwnReview(reviews, 'mid', 'newest');
    expect(own?.id).toBe('mid');
    expect(ids(others)).toEqual(['new', 'old-popular']);
  });

  it('has no own review when signed out', () => {
    const { own, others } = splitOwnReview(reviews, null, 'newest');
    expect(own).toBeNull();
    expect(others).toHaveLength(3);
  });
});

describe('isReviewSort', () => {
  it('accepts only the known sorts', () => {
    expect(isReviewSort('helpful')).toBe(true);
    expect(isReviewSort('rating')).toBe(false);
  });
});
