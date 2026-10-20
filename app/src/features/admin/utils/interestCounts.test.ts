import { describe, expect, it } from 'vitest';
import { countInterest } from './interestCounts';

describe('countInterest', () => {
  it('counts per bundle and period, busiest first', () => {
    const rows = countInterest([
      { bundleId: 'a', period: 'monthly' },
      { bundleId: 'b', period: 'yearly' },
      { bundleId: 'b', period: 'yearly' },
      { bundleId: 'b', period: 'monthly' },
    ]);
    expect(rows.map((row) => row.bundleId)).toEqual(['b', 'a']);
    expect(rows[0]).toEqual({
      bundleId: 'b',
      total: 3,
      periods: { monthly: 1, quarterly: 0, yearly: 2 },
    });
  });

  it('lists known bundles with no interest as zero rows', () => {
    const rows = countInterest([{ bundleId: 'a', period: 'quarterly' }], ['a', 'z']);
    expect(rows.find((row) => row.bundleId === 'z')?.total).toBe(0);
    expect(rows.find((row) => row.bundleId === 'a')?.periods.quarterly).toBe(1);
  });
});
