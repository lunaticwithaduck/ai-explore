import { describe, expect, it } from 'vitest';
import { activeFilterCount, EMPTY_FILTERS, panelFilterCount } from './libraryFilters';

describe('filter counts', () => {
  it('is zero for the empty filters', () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
    expect(panelFilterCount(EMPTY_FILTERS)).toBe(0);
  });

  it('counts query, category, each tag and price', () => {
    const filters = {
      ...EMPTY_FILTERS,
      q: 'x',
      category: 'text',
      tags: ['a', 'b'],
      price: 'free' as const,
    };
    expect(activeFilterCount(filters)).toBe(5);
    expect(panelFilterCount(filters)).toBe(3);
  });
});
