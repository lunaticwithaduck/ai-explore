import { bundleSchema } from '@ai-explore/schemas';
import type { z } from 'zod';
import { localizedFormSchema } from './toolForm';

export const bundleFormSchema = bundleSchema
  .pick({ slug: true, icon: true, accent: true, pricing: true, published: true })
  .extend({
    name: localizedFormSchema,
    description: localizedFormSchema,
    toolIds: bundleSchema.shape.toolIds,
  });

export type BundleFormValues = z.infer<typeof bundleFormSchema>;

export const NEW_BUNDLE_SLUG = 'new';

export const defaultBundleFormValues = (): BundleFormValues => ({
  slug: '',
  name: { en: '', bg: '' },
  description: { en: '', bg: '' },
  toolIds: [],
  icon: 'sparkles',
  accent: 'blue',
  pricing: {
    monthly: { priceCents: 0 },
    quarterly: { priceCents: 0 },
    yearly: { priceCents: 0 },
  },
  published: false,
});
