import type { Bundle } from '@ai-explore/schemas';
import type { BundleFormValues } from '../config/bundleForm';
import { fromLocalized, toLocalized } from './toolDocument';

export const buildBundleDocument = (values: BundleFormValues): Bundle => ({
  slug: values.slug,
  name: toLocalized(values.name),
  description: toLocalized(values.description),
  toolIds: values.toolIds,
  icon: values.icon.trim(),
  accent: values.accent,
  pricing: values.pricing,
  published: values.published,
});

export const bundleToFormValues = (bundle: Bundle): BundleFormValues => ({
  slug: bundle.slug,
  name: fromLocalized(bundle.name),
  description: fromLocalized(bundle.description),
  toolIds: bundle.toolIds,
  icon: bundle.icon,
  accent: bundle.accent,
  pricing: bundle.pricing,
  published: bundle.published,
});
