import { describe, expect, it } from 'vitest';
import type { Plan } from './plan';
import {
  bundleListPriceCents,
  bundleSavingsPercent,
  cheapestPaidPlanCents,
  monthlyNormalizedCents,
  summarizeBundlePeriod,
} from './pricing';

const plan = (priceCents: number | null, period: Plan['period']): Plan => ({
  name: 'p',
  priceCents,
  period,
  features: [],
});

describe('INV-13 bundle pricing', () => {
  it.each([
    { prices: [2000, 1000], period: 'monthly', list: 3000 },
    { prices: [2000, 1000], period: 'quarterly', list: 9000 },
    { prices: [2000, 1000], period: 'yearly', list: 36000 },
    { prices: [2000, undefined], period: 'monthly', list: 2000 },
    { prices: [], period: 'yearly', list: 0 },
  ] as const)('list price of $prices over $period is $list', ({ prices, period, list }) => {
    expect(bundleListPriceCents(prices, period)).toBe(list);
  });

  it.each([
    { list: 12000, price: 8900, savings: 26 },
    { list: 36000, price: 24900, savings: 31 },
    { list: 200, price: 133, savings: 34 },
    { list: 200, price: 101, savings: 50 },
    { list: 1000, price: 1200, savings: 0 },
    { list: 0, price: 500, savings: 0 },
  ])('savings of $price against $list is $savings%', ({ list, price, savings }) => {
    expect(bundleSavingsPercent(list, price)).toBe(savings);
  });

  it('a tool without a paid plan contributes nothing to the list price', () => {
    const fromPrice = cheapestPaidPlanCents([plan(null, 'custom'), plan(0, 'month')]);
    expect(fromPrice).toBeUndefined();
    expect(bundleListPriceCents([fromPrice, 1500], 'monthly')).toBe(1500);
  });

  it('an empty bundle summarizes without dividing by zero', () => {
    expect(summarizeBundlePeriod(0, [], 'quarterly')).toEqual({
      period: 'quarterly',
      priceCents: 0,
      listPriceCents: 0,
      savingsPercent: 0,
      perMonthCents: 0,
    });
  });

  it('summarizes a period with per-month price', () => {
    expect(summarizeBundlePeriod(89900, [3000, 2000, 7500, 2500], 'yearly')).toEqual({
      period: 'yearly',
      priceCents: 89900,
      listPriceCents: 180000,
      savingsPercent: 50,
      perMonthCents: 7492,
    });
  });
});

describe('plan normalisation', () => {
  it('normalises yearly plans to months and skips free or custom plans', () => {
    expect(monthlyNormalizedCents(plan(12000, 'year'))).toBe(1000);
    expect(monthlyNormalizedCents(plan(1999, 'month'))).toBe(1999);
    expect(monthlyNormalizedCents(plan(0, 'month'))).toBeUndefined();
    expect(monthlyNormalizedCents(plan(null, 'custom'))).toBeUndefined();
  });

  it('picks the cheapest paid plan, monthly-normalised', () => {
    expect(cheapestPaidPlanCents([plan(3000, 'month'), plan(24000, 'year')])).toBe(2000);
  });
});
