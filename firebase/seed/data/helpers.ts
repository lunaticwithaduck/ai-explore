import { cheapestPaidPlanCents, type Plan, type ToolPricing } from '@ai-explore/schemas';

const DAY_MS = 86_400_000;

export function daysAgo(days: number): Date {
  const midnight = Math.floor(Date.now() / DAY_MS) * DAY_MS;
  return new Date(midnight - days * DAY_MS);
}

export function buildPricing(plans: Plan[], hasFreePlan: boolean, trialDays?: number): ToolPricing {
  const fromPriceCents = cheapestPaidPlanCents(plans);
  return {
    hasFreePlan,
    ...(trialDays === undefined ? {} : { trialDays }),
    ...(fromPriceCents === undefined ? {} : { fromPriceCents }),
  };
}
