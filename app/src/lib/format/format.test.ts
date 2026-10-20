import { describe, expect, it } from 'vitest';
import { formatCents } from './money';
import { averageRating, formatAverage } from './rating';
import { formatVersion } from './version';

describe('INV-16 rating display', () => {
  it.each([
    { count: 0, sum: 0, expected: null },
    { count: 1, sum: 5, expected: 5 },
    { count: 3, sum: 13, expected: 4.3 },
    { count: 6, sum: 25, expected: 4.2 },
    { count: 7, sum: 32, expected: 4.6 },
  ])('average of $sum over $count is $expected', ({ count, sum, expected }) => {
    expect(averageRating({ count, sum })).toBe(expected);
  });

  it('formats to exactly one decimal', () => {
    expect(formatAverage(5, 'en')).toBe('5.0');
    expect(formatAverage(4.3, 'bg')).toBe('4,3');
  });
});

describe('INV-17 version label', () => {
  it.each([
    ['2.1.0', '2.1.0'],
    ['v2.1.0', '2.1.0'],
    ['V7', '7'],
    ['Version 6.1', '6.1'],
    [' 1.0.3 ', '1.0.3'],
  ])('%s renders as %s', (input, expected) => {
    expect(formatVersion(input)).toBe(expected);
  });
});

describe('money', () => {
  it('formats whole dollars without decimals and cents with two', () => {
    expect(formatCents(2000, 'en')).toBe('$20');
    expect(formatCents(1999, 'en')).toBe('$19.99');
  });
});
