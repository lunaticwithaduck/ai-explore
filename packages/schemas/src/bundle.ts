import { z } from 'zod';
import { accentSchema, centsSchema, slugSchema } from './common';
import { localizedSchema } from './localized';

export const BUNDLE_PERIODS = ['monthly', 'quarterly', 'yearly'] as const;
export const bundlePeriodSchema = z.enum(BUNDLE_PERIODS);
export type BundlePeriod = z.infer<typeof bundlePeriodSchema>;

const periodPriceSchema = z.object({ priceCents: centsSchema });

export const bundleSchema = z.object({
  slug: slugSchema,
  name: localizedSchema,
  description: localizedSchema,
  toolIds: z.array(slugSchema).min(2),
  icon: z.string().min(1),
  accent: accentSchema,
  pricing: z.object({
    monthly: periodPriceSchema,
    quarterly: periodPriceSchema,
    yearly: periodPriceSchema,
  }),
  published: z.boolean(),
});

export type Bundle = z.infer<typeof bundleSchema>;
