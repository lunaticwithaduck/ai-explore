import { describe, expect, it } from 'vitest';
import { clipDisplayName } from './displayName';

describe('clipDisplayName', () => {
  it('returns short strings unchanged', () => {
    expect(clipDisplayName('Ada', 60)).toBe('Ada');
  });

  it('does not split an emoji at the boundary', () => {
    const name = `${'a'.repeat(59)}😀b`;
    const clipped = clipDisplayName(name, 60);
    expect(clipped).toBe('a'.repeat(59));
    expect(clipped.length).toBeLessThanOrEqual(60);
  });

  it('keeps combined emoji sequences whole', () => {
    const family = '👨‍👩‍👧';
    const clipped = clipDisplayName(`${'a'.repeat(55)}${family}`, 60);
    expect(clipped).toBe('a'.repeat(55));
  });

  it('fills up to the limit with whole graphemes', () => {
    expect(clipDisplayName('😀'.repeat(40), 60)).toBe('😀'.repeat(30));
  });
});
