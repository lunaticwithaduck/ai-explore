import { REVIEW_LIMITS } from '@ai-explore/schemas';

export const REVIEW_SORTS = ['newest', 'helpful'] as const;

export type ReviewSort = (typeof REVIEW_SORTS)[number];

export const DEFAULT_REVIEW_SORT: ReviewSort = 'newest';

export const REVIEW_BODY_MAX = REVIEW_LIMITS.bodyMax;

export const PHOTO_URL_MAX = 2048;

export const EDITED_AFTER_MS = 60_000;
