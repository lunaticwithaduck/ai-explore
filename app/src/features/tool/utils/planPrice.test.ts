import { describe, expect, it } from 'vitest';
import { getPlanPrice } from './planPrice';

describe('getPlanPrice', () => {
  it('free when the price is zero', () => {
    expect(getPlanPrice({ priceCents: 0, period: 'month' })).toEqual({ kind: 'free' });
  });

  it('monthly and yearly keep the cents', () => {
    expect(getPlanPrice({ priceCents: 2000, period: 'month' })).toEqual({
      kind: 'month',
      cents: 2000,
    });
    expect(getPlanPrice({ priceCents: 19900, period: 'year' })).toEqual({
      kind: 'year',
      cents: 19900,
    });
  });

  it('custom for a custom period or a null price', () => {
    expect(getPlanPrice({ priceCents: null, period: 'custom' })).toEqual({ kind: 'custom' });
    expect(getPlanPrice({ priceCents: null, period: 'month' })).toEqual({ kind: 'custom' });
  });
});
