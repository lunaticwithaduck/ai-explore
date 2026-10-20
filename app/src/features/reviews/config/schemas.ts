import { REVIEW_LIMITS } from '@ai-explore/schemas';
import { z } from 'zod';

export const reviewFormSchema = z.object({
  rating: z
    .number()
    .int()
    .min(REVIEW_LIMITS.ratingMin, { error: 'ratingRequired' })
    .max(REVIEW_LIMITS.ratingMax, { error: 'ratingRequired' }),
  body: z.string().trim().max(REVIEW_LIMITS.bodyMax, { error: 'bodyTooLong' }),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const EMPTY_REVIEW_FORM: ReviewFormValues = { rating: 0, body: '' };
