import { describe, expect, it } from 'vitest';
import type { AuthUser } from '../state/authSlice';
import { deriveDisplayName, safePhotoUrl } from './profileSeed';

const base: AuthUser = { uid: 'uid-1', email: null, displayName: null, photoUrl: null };

describe('deriveDisplayName', () => {
  it('prefers the auth display name, then the email local part, then the uid', () => {
    expect(deriveDisplayName({ ...base, displayName: '  Ada  ', email: 'x@y.z' })).toBe('Ada');
    expect(deriveDisplayName({ ...base, email: 'grace@example.com' })).toBe('grace');
    expect(deriveDisplayName({ ...base, displayName: '   ' })).toBe('uid-1');
  });

  it('never exceeds the 60 characters the rules allow', () => {
    expect(deriveDisplayName({ ...base, displayName: 'x'.repeat(80) })).toHaveLength(60);
  });
});

describe('safePhotoUrl', () => {
  it('keeps https urls and drops anything else', () => {
    expect(safePhotoUrl('https://lh3.example.com/a.png')).toBe('https://lh3.example.com/a.png');
    expect(safePhotoUrl('http://lh3.example.com/a.png')).toBeNull();
    expect(safePhotoUrl('HTTPS://lh3.example.com/a.png')).toBeNull();
    expect(safePhotoUrl('https://lh3.example.com/a b.png')).toBeNull();
    expect(safePhotoUrl('https://[')).toBeNull();
    expect(safePhotoUrl(null)).toBeNull();
    expect(safePhotoUrl('not a url')).toBeNull();
    expect(safePhotoUrl('data:image/png;base64,AAAA')).toBeNull();
    expect(safePhotoUrl(`https://x.example/${'a'.repeat(2100)}`)).toBeNull();
  });
});
