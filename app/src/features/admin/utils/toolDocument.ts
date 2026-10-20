import { cheapestPaidPlanCents, type Localized, type Tool } from '@ai-explore/schemas';
import type { ToolFormValues } from '../config/toolForm';

export const toLocalized = (value: { en: string; bg: string }): Localized => {
  const bg = value.bg.trim();
  return bg ? { en: value.en.trim(), bg } : { en: value.en.trim() };
};

export const fromLocalized = (value: Localized): { en: string; bg: string } => ({
  en: value.en,
  bg: value.bg ?? '',
});

const buildPricing = (values: ToolFormValues) => {
  const fromPriceCents = cheapestPaidPlanCents(values.plans);
  return {
    hasFreePlan: values.pricing.hasFreePlan,
    ...(values.pricing.trialDays === undefined ? {} : { trialDays: values.pricing.trialDays }),
    ...(fromPriceCents === undefined ? {} : { fromPriceCents }),
  };
};

const buildEditable = (values: ToolFormValues) => ({
  name: values.name.trim(),
  developer: values.developer.trim(),
  websiteUrl: values.websiteUrl.trim(),
  tagline: toLocalized(values.tagline),
  description: toLocalized(values.description),
  categoryId: values.categoryId,
  tags: values.tags.map((tag) => tag.value),
  logo: { path: values.logo.path.trim(), background: values.logo.background.trim() },
  pricing: buildPricing(values),
  plans: values.plans.map((plan) => ({
    name: plan.name.trim(),
    priceCents: plan.priceCents,
    period: plan.period,
    features: plan.features,
    ...(plan.popular === undefined ? {} : { popular: plan.popular }),
  })),
  features: values.features.map(toLocalized),
  published: values.published,
});

export function buildToolDocument<Stamp>(values: ToolFormValues, stamp: Stamp) {
  const tagline = toLocalized(values.tagline);
  return {
    ...buildEditable(values),
    slug: values.slug,
    rating: { count: 0, sum: 0 },
    tutorials: [],
    comparison: {
      apiAccess: 'none' as const,
      integrations: 0,
      speed: 3,
      outputQuality: 3,
      bestUseCase: tagline,
    },
    similarToolIds: [],
    complementaryToolIds: [],
    createdAt: stamp,
    updatedAt: stamp,
    lastReleaseAt: stamp,
  };
}

export function buildToolPatch<Stamp>(values: ToolFormValues, stamp: Stamp) {
  return { ...buildEditable(values), updatedAt: stamp };
}

export function toolToFormValues(tool: Tool): ToolFormValues {
  return {
    slug: tool.slug,
    name: tool.name,
    developer: tool.developer,
    websiteUrl: tool.websiteUrl,
    tagline: fromLocalized(tool.tagline),
    description: fromLocalized(tool.description),
    categoryId: tool.categoryId,
    tags: tool.tags.map((value) => ({ value })),
    logo: { ...tool.logo },
    pricing: {
      hasFreePlan: tool.pricing.hasFreePlan,
      ...(tool.pricing.trialDays === undefined ? {} : { trialDays: tool.pricing.trialDays }),
    },
    plans: tool.plans,
    features: tool.features.map(fromLocalized),
    published: tool.published,
  };
}
