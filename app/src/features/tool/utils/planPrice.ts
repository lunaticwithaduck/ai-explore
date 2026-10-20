import type { Plan } from '@ai-explore/schemas';

export type PlanPrice =
  | { kind: 'free' }
  | { kind: 'custom' }
  | { kind: 'month' | 'year'; cents: number };

export function getPlanPrice(plan: Pick<Plan, 'priceCents' | 'period'>): PlanPrice {
  if (plan.period === 'custom' || plan.priceCents === null) return { kind: 'custom' };
  if (plan.priceCents === 0) return { kind: 'free' };
  return { kind: plan.period, cents: plan.priceCents };
}
