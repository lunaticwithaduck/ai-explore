import { z } from 'zod';
import { localeSchema, slugSchema, timestampSchema } from './common';
import { DISPLAY_NAME_MAX } from './user';

export const REVIEW_LIMITS = { ratingMin: 1, ratingMax: 5, bodyMax: 2000 } as const;

export const reviewSchema = z.object({
  toolId: slugSchema,
  authorUid: z.string().min(1),
  rating: z.number().int().min(REVIEW_LIMITS.ratingMin).max(REVIEW_LIMITS.ratingMax),
  body: z.string().max(REVIEW_LIMITS.bodyMax),
  authorName: z.string().min(1).max(DISPLAY_NAME_MAX),
  authorPhotoUrl: z.url().nullable(),
  locale: localeSchema,
  helpfulCount: z.number().int().nonnegative(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type Review = z.infer<typeof reviewSchema>;

export const reviewVoteSchema = z.object({
  createdAt: timestampSchema,
});

export type ReviewVote = z.infer<typeof reviewVoteSchema>;
