import { describe, expect, it } from 'vitest';
import { fieldErrorKey, isEmptyValue } from './fieldErrors';

describe('fieldErrorKey', () => {
  it('reports required for empty values whatever the rule', () => {
    expect(fieldErrorKey({ name: 'slug', type: 'invalid_format', empty: true })).toBe('required');
    expect(fieldErrorKey({ name: 'name', type: 'too_small', empty: true })).toBe('required');
  });

  it('maps format failures to the field rule', () => {
    const key = (name: string) => fieldErrorKey({ name, type: 'invalid_format', empty: false });
    expect(key('slug')).toBe('slug');
    expect(key('tags.2.value')).toBe('slug');
    expect(key('websiteUrl')).toBe('url');
    expect(key('logo.path')).toBe('logoPath');
    expect(key('logo.background')).toBe('hex');
    expect(key('tutorials.0.youtubeId')).toBe('youtubeId');
    expect(key('version')).toBe('version');
    expect(key('icon')).toBe('invalid');
  });

  it('maps numeric failures', () => {
    expect(
      fieldErrorKey({ name: 'comparison.speed', type: 'too_big', empty: false, numeric: true }),
    ).toBe('range');
    expect(
      fieldErrorKey({
        name: 'comparison.speed',
        type: 'invalid_type',
        empty: false,
        numeric: true,
      }),
    ).toBe('number');
  });

  it('maps money and taken slugs', () => {
    expect(
      fieldErrorKey({
        name: 'plans.0.priceCents',
        type: 'invalid_type',
        empty: false,
        money: true,
      }),
    ).toBe('price');
    expect(fieldErrorKey({ name: 'slug', type: 'taken', empty: false })).toBe('taken');
  });

  it('detects empty values', () => {
    expect(isEmptyValue('  ')).toBe(true);
    expect(isEmptyValue(undefined)).toBe(true);
    expect(isEmptyValue(0)).toBe(false);
    expect(isEmptyValue(Number.NaN)).toBe(false);
  });
});
