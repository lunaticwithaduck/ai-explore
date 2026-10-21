import { describe, expect, it } from 'vitest';
import { centsToDollars, dollarsToCents } from './money';

describe('admin money', () => {
  it('converts dollars to whole cents', () => {
    expect(dollarsToCents('20')).toBe(2000);
    expect(dollarsToCents('19.99')).toBe(1999);
    expect(dollarsToCents('1.15')).toBe(115);
    expect(dollarsToCents('0,5')).toBe(50);
    expect(dollarsToCents(' 7.5 ')).toBe(750);
  });

  it('rejects text that is not a price', () => {
    expect(dollarsToCents('')).toBeNaN();
    expect(dollarsToCents('abc')).toBeNaN();
    expect(dollarsToCents('-3')).toBeNaN();
    expect(dollarsToCents('1.999')).toBeNaN();
  });

  it('converts cents back to a dollar string', () => {
    expect(centsToDollars(2000)).toBe('20');
    expect(centsToDollars(1999)).toBe('19.99');
    expect(centsToDollars(50)).toBe('0.50');
    expect(centsToDollars(null)).toBe('');
    expect(centsToDollars(undefined)).toBe('');
  });

  it('round-trips', () => {
    for (const cents of [0, 1, 99, 100, 1234, 99999]) {
      expect(dollarsToCents(centsToDollars(cents))).toBe(cents);
    }
  });
});
