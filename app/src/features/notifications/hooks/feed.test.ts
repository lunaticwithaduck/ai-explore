import type { ToolUpdate, WithId } from '@ai-explore/schemas';
import { describe, expect, it } from 'vitest';
import {
  chunk,
  countNew,
  isNewUpdate,
  mergeUpdates,
  windowStart,
} from '@/api/endpoints/notifications';

const update = (id: string, at: string) =>
  ({ id, publishedAt: new Date(at) }) as unknown as WithId<ToolUpdate>;

describe('isNewUpdate', () => {
  const seen = new Date('2026-10-10T00:00:00Z');
  it('treats everything as new when never seen', () => {
    expect(isNewUpdate(new Date('2020-01-01'), null)).toBe(true);
  });
  it('is new only strictly after the seen time', () => {
    expect(isNewUpdate(new Date('2026-10-10T00:00:01Z'), seen)).toBe(true);
    expect(isNewUpdate(seen, seen)).toBe(false);
    expect(isNewUpdate(new Date('2026-10-09T00:00:00Z'), seen)).toBe(false);
  });
  it('counts new items', () => {
    const items = [
      { update: { publishedAt: new Date('2026-10-11') } },
      { update: { publishedAt: new Date('2026-10-01') } },
    ];
    expect(countNew(items, seen)).toBe(1);
    expect(countNew(items, null)).toBe(2);
  });
});

describe('chunk', () => {
  it('splits at 30', () => {
    const ids = Array.from({ length: 65 }, (_, i) => `t${i}`);
    expect(chunk(ids, 30).map((c) => c.length)).toEqual([30, 30, 5]);
  });
  it('returns nothing for an empty list', () => {
    expect(chunk([], 30)).toEqual([]);
  });
});

describe('mergeUpdates', () => {
  it('sorts all chunks newest first with a stable id tiebreak', () => {
    const merged = mergeUpdates([
      [update('b', '2026-10-02'), update('a', '2026-10-01')],
      [update('d', '2026-10-03'), update('c', '2026-10-02')],
    ]);
    expect(merged.map((u) => u.id)).toEqual(['d', 'b', 'c', 'a']);
  });
});

describe('windowStart', () => {
  it('subtracts whole days', () => {
    expect(windowStart(new Date('2026-10-31T00:00:00Z'), 30).toISOString()).toBe(
      '2026-10-01T00:00:00.000Z',
    );
  });
});
