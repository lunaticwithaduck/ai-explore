import type { Locale, Plan } from '@ai-explore/schemas';
import { useLocale, useTranslations } from 'next-intl';
import { formatCents } from '@/lib/format/money';
import { getPlanPrice } from '../utils/planPrice';

export type PlanPriceLabel = { amount: string; period: string | null };

export function usePlanPriceLabel(plan: Pick<Plan, 'priceCents' | 'period'>): PlanPriceLabel {
  const t = useTranslations('tool.plans');
  const locale = useLocale() as Locale;
  const price = getPlanPrice(plan);
  if (price.kind === 'free') return { amount: t('free'), period: null };
  if (price.kind === 'custom') return { amount: t('custom'), period: null };
  return {
    amount: formatCents(price.cents, locale),
    period: price.kind === 'month' ? t('perMonth') : t('perYear'),
  };
}
