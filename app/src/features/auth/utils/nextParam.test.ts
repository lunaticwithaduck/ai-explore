import { describe, expect, it } from 'vitest';
import { isAuthRoute, sanitizeNext, signInHref, signUpHref } from './nextParam';

describe('sanitizeNext', () => {
  it.each([
    ['/library', '/library'],
    ['/tools/midjourney', '/tools/midjourney'],
    ['/library?collection=abc#top', '/library?collection=abc#top'],
    ['/compare?a=chatgpt&b=claude', '/compare?a=chatgpt&b=claude'],
    ['/tools/x?y=1#z', '/tools/x?y=1#z'],
    ['/bg/settings', '/settings'],
    ['/', '/'],
  ])('keeps the same-origin relative path %s', (raw, expected) => {
    expect(sanitizeNext(raw)).toBe(expected);
  });

  it.each([
    [null],
    [undefined],
    [''],
    ['library'],
    ['https://evil.example/phish'],
    ['//evil.example/phish'],
    ['/\\evil.example'],
    ['\\\\evil.example'],
    ['javascript:alert(1)'],
    ['/library\nSet-Cookie: x=1'],
    ['/tools/\u0000x'],
    [' /library'],
  ])('rejects %j', (raw) => {
    expect(sanitizeNext(raw)).toBeNull();
  });

  it.each([
    ['/.//evil.example'],
    ['/x/..//evil.example'],
    ['/%2e//evil.example'],
    ['/%2E%2E//evil.example/x'],
    ['/%2E%2E//evil.example/path?q=1#h'],
    ['/bg//evil.example'],
    ['/bg/.//evil.example'],
    ['\\\\evil.example'],
    ['/\\\\evil.example'],
    ['/%5Cevil.example'],
    ['https:evil.example'],
    ['%2F%2Fevil.example'],
    ['/%2F%2Fevil.example'],
    ['/%09/evil.example'],
    ['/%0d%0a/evil.example'],
    ['/%E0%A4%A'],
  ])('rejects %j, which normalises to another origin or an unsafe path', (raw) => {
    const result = sanitizeNext(raw);
    expect(result).toBeNull();
    expect(signInHref(raw)).toBe('/sign-in');
  });

  it('strips a locale prefix so the router can apply the current locale', () => {
    expect(sanitizeNext('/bg/library')).toBe('/library');
    expect(sanitizeNext('/bg')).toBe('/');
    expect(sanitizeNext('/en/tools/claude?x=1')).toBe('/tools/claude?x=1');
    expect(sanitizeNext('/bgx/library')).toBe('/bgx/library');
  });

  it('refuses to bounce back into an auth page', () => {
    expect(sanitizeNext('/sign-in')).toBeNull();
    expect(sanitizeNext('/bg/sign-up?next=/library')).toBeNull();
    expect(sanitizeNext('/reset-password')).toBeNull();
  });
});

describe('isAuthRoute', () => {
  it('recognises auth pages with or without a locale prefix', () => {
    expect(isAuthRoute('/sign-in')).toBe(true);
    expect(isAuthRoute('/bg/sign-up')).toBe(true);
    expect(isAuthRoute('/reset-password')).toBe(true);
    expect(isAuthRoute('/library')).toBe(false);
    expect(isAuthRoute('/')).toBe(false);
  });
});

describe('signInHref / signUpHref', () => {
  it('appends an encoded next for a safe path', () => {
    expect(signInHref('/library?collection=a b')).toBe(
      `/sign-in?next=${encodeURIComponent('/library?collection=a%20b')}`,
    );
    expect(signUpHref('/tools/claude')).toBe('/sign-up?next=%2Ftools%2Fclaude');
  });

  it('drops an unsafe, empty or library next', () => {
    expect(signInHref('https://evil.example')).toBe('/sign-in');
    expect(signInHref(null)).toBe('/sign-in');
    expect(signInHref('/')).toBe('/sign-in');
  });
});
