import { z } from 'zod';
import { centsSchema } from './common';
import { localizedSchema } from './localized';

export const PLAN_PERIODS = ['month', 'year', 'custom'] as const;

export const planSchema = z.object({
  name: z.string().min(1),
  priceCents: centsSchema.nullable(),
  period: z.enum(PLAN_PERIODS),
  features: z.array(localizedSchema),
  popular: z.boolean().optional(),
});

export type Plan = z.infer<typeof planSchema>;

export const toolPricingSchema = z.object({
  hasFreePlan: z.boolean(),
  trialDays: z.number().int().positive().optional(),
  fromPriceCents: centsSchema.optional(),
});

export type ToolPricing = z.infer<typeof toolPricingSchema>;
