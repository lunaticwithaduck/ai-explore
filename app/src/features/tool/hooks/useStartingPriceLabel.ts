import type { Locale, ToolPricing } from '@ai-explore/schemas';
import { useLocale, useTranslations } from 'next-intl';
import { formatCents } from '@/lib/format/money';

export function useStartingPriceLabel(pricing: ToolPricing): string {
  const t = useTranslations('tool.plans');
  const locale = useLocale() as Locale;
  if (pricing.hasFreePlan) return t('free');
  if (pricing.fromPriceCents === undefined) return t('custom');
  return t('perMonth', { price: formatCents(pricing.fromPriceCents, locale) });
}
