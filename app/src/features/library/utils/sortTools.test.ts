import { describe, expect, it } from 'vitest';
import type { SortKey } from '../config/constants';
import { sortTools } from './sortTools';
import { makeTool } from './testTools';

const tools = [
  makeTool('a', {
    rating: { count: 10, sum: 40 },
    pricing: { hasFreePlan: false, fromPriceCents: 2000 },
    lastReleaseAt: new Date('2026-01-01'),
  }),
  makeTool('b', {
    rating: { count: 2, sum: 10 },
    pricing: { hasFreePlan: true, fromPriceCents: 900 },
    lastReleaseAt: new Date('2026-03-01'),
  }),
  makeTool('c', {
    rating: { count: 0, sum: 0 },
    pricing: { hasFreePlan: false, fromPriceCents: 500 },
    lastReleaseAt: new Date('2026-02-01'),
  }),
  makeTool('d', {
    rating: { count: 50, sum: 200 },
    pricing: { hasFreePlan: false, fromPriceCents: 2000 },
    lastReleaseAt: new Date('2025-01-01'),
  }),
];

describe('sortTools', () => {
  const cases: [SortKey, string[]][] = [
    ['rating', ['b', 'd', 'a', 'c']],
    ['reviews', ['d', 'a', 'b', 'c']],
    ['priceAsc', ['b', 'c', 'a', 'd']],
    ['priceDesc', ['a', 'd', 'c', 'b']],
    ['newest', ['b', 'c', 'a', 'd']],
  ];
  it.each(cases)('%s', (sort, expected) => {
    expect(sortTools(tools, sort).map((t) => t.id)).toEqual(expected);
  });

  it('does not mutate the input', () => {
    const copy = [...tools];
    sortTools(tools, 'newest');
    expect(tools).toEqual(copy);
  });
});
