import { describe, expect, it } from 'vitest';
import { pickLocalized } from './localized';

describe('INV-15 localized fallback', () => {
  it('uses bg when present and falls back to en otherwise', () => {
    expect(pickLocalized({ en: 'Tools', bg: 'Инструменти' }, 'bg')).toBe('Инструменти');
    expect(pickLocalized({ en: 'Tools' }, 'bg')).toBe('Tools');
    expect(pickLocalized({ en: 'Tools', bg: 'Инструменти' }, 'en')).toBe('Tools');
  });
});
