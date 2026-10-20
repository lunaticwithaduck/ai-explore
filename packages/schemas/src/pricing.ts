import type { BundlePeriod } from './bundle';
import type { Plan } from './plan';

export const PERIOD_MONTHS: Record<BundlePeriod, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

export function monthlyNormalizedCents(plan: Plan): number | undefined {
  if (plan.priceCents === null || plan.priceCents === 0) return undefined;
  if (plan.period === 'month') return plan.priceCents;
  if (plan.period === 'year') return Math.round(plan.priceCents / 12);
  return undefined;
}

export function cheapestPaidPlanCents(plans: readonly Plan[]): number | undefined {
  const prices = plans
    .map(monthlyNormalizedCents)
    .filter((price): price is number => price !== undefined);
  return prices.length > 0 ? Math.min(...prices) : undefined;
}

export function bundleListPriceCents(
  toolFromPrices: readonly (number | undefined)[],
  period: BundlePeriod,
): number {
  const monthly = toolFromPrices.reduce<number>((sum, price) => sum + (price ?? 0), 0);
  return monthly * PERIOD_MONTHS[period];
}

export function bundleSavingsPercent(listPriceCents: number, priceCents: number): number {
  if (listPriceCents <= 0) return 0;
  const percent = Math.round(((listPriceCents - priceCents) / listPriceCents) * 100);
  return Math.max(0, percent);
}

export type BundlePeriodSummary = {
  period: BundlePeriod;
  priceCents: number;
  listPriceCents: number;
  savingsPercent: number;
  perMonthCents: number;
};

export function summarizeBundlePeriod(
  priceCents: number,
  toolFromPrices: readonly (number | undefined)[],
  period: BundlePeriod,
): BundlePeriodSummary {
  const listPriceCents = bundleListPriceCents(toolFromPrices, period);
  return {
    period,
    priceCents,
    listPriceCents,
    savingsPercent: bundleSavingsPercent(listPriceCents, priceCents),
    perMonthCents: Math.round(priceCents / PERIOD_MONTHS[period]),
  };
}
