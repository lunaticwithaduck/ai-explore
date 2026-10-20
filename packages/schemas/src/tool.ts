import { z } from 'zod';
import { hexColorSchema, slugSchema, timestampSchema } from './common';
import { localizedSchema } from './localized';
import { planSchema, toolPricingSchema } from './plan';
import { tutorialSchema } from './tutorial';

export const API_ACCESS = ['none', 'limited', 'full'] as const;

export const comparisonSchema = z.object({
  apiAccess: z.enum(API_ACCESS),
  integrations: z.number().int().nonnegative(),
  speed: z.number().int().min(1).max(5),
  outputQuality: z.number().int().min(1).max(5),
  bestUseCase: localizedSchema,
});

export const ratingAggregateSchema = z.object({
  count: z.number().int().nonnegative(),
  sum: z.number().int().nonnegative(),
});

export const toolSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1),
  developer: z.string().min(1),
  websiteUrl: z.url(),
  tagline: localizedSchema,
  description: localizedSchema,
  categoryId: slugSchema,
  tags: z.array(slugSchema),
  logo: z.object({
    path: z.string().regex(/^\/logos\/[a-z0-9-]+\.(png|svg|webp)$/),
    background: hexColorSchema,
  }),
  pricing: toolPricingSchema,
  plans: z.array(planSchema),
  features: z.array(localizedSchema),
  tutorials: z.array(tutorialSchema),
  comparison: comparisonSchema,
  similarToolIds: z.array(slugSchema),
  complementaryToolIds: z.array(slugSchema),
  rating: ratingAggregateSchema,
  published: z.boolean(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  lastReleaseAt: timestampSchema,
});

export type Tool = z.infer<typeof toolSchema>;
export type Comparison = z.infer<typeof comparisonSchema>;
export type RatingAggregate = z.infer<typeof ratingAggregateSchema>;
