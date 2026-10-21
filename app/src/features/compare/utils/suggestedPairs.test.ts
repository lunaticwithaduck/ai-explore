import { describe, expect, it } from 'vitest';
import { makeTool } from '../../library/utils/testTools';
import { suggestedPairs } from './suggestedPairs';

describe('suggestedPairs', () => {
  it('pairs each tool with its first similar tool without duplicates', () => {
    const a = makeTool('a', { similarToolIds: ['b'] });
    const b = makeTool('b', { similarToolIds: ['a'] });
    const c = makeTool('c', { similarToolIds: ['a'] });
    const pairs = suggestedPairs([a, b, c], 3);
    expect(pairs.map(([x, y]) => `${x.id}-${y.id}`)).toEqual(['a-b', 'c-a']);
  });
});
