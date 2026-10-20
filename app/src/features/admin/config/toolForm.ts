import { planSchema, slugSchema, toolPricingSchema, toolSchema } from '@ai-explore/schemas';
import { z } from 'zod';

export const localizedFormSchema = z.object({
  en: z.string().trim().min(1),
  bg: z.string().trim(),
});

export const toolFormSchema = toolSchema
  .pick({
    slug: true,
    name: true,
    developer: true,
    websiteUrl: true,
    categoryId: true,
    logo: true,
    published: true,
  })
  .extend({
    tagline: localizedFormSchema,
    description: localizedFormSchema,
    tags: z.array(z.object({ value: slugSchema })),
    pricing: toolPricingSchema.pick({ hasFreePlan: true, trialDays: true }),
    plans: z.array(planSchema),
    features: z.array(localizedFormSchema),
  });

export type ToolFormValues = z.infer<typeof toolFormSchema>;

export const defaultToolFormValues = (): ToolFormValues => ({
  slug: '',
  name: '',
  developer: '',
  websiteUrl: '',
  tagline: { en: '', bg: '' },
  description: { en: '', bg: '' },
  categoryId: '',
  tags: [],
  logo: { path: '', background: '' },
  pricing: { hasFreePlan: false },
  plans: [],
  features: [],
  published: false,
});

export const EMPTY_PLAN: ToolFormValues['plans'][number] = {
  name: '',
  priceCents: null,
  period: 'month',
  features: [],
};

export const EMPTY_LOCALIZED = { en: '', bg: '' } as const;
