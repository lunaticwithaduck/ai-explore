import type { Locale, Plan } from '@ai-explore/schemas';
import { useLocale, useTranslations } from 'next-intl';
import { formatCents } from '@/lib/format/money';
import { getPlanPrice } from '../utils/planPrice';

export function usePlanPriceLabel(plan: Pick<Plan, 'priceCents' | 'period'>): string {
  const t = useTranslations('tool.plans');
  const locale = useLocale() as Locale;
  const price = getPlanPrice(plan);
  if (price.kind === 'free') return t('free');
  if (price.kind === 'custom') return t('custom');
  const amount = formatCents(price.cents, locale);
  return price.kind === 'month'
    ? t('perMonth', { price: amount })
    : t('perYear', { price: amount });
}
