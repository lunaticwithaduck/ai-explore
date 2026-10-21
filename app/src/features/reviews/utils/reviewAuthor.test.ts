import { describe, expect, it } from 'vitest';
import { reviewAuthor } from './reviewAuthor';

const user = { uid: 'u1' };

describe('reviewAuthor', () => {
  it('copies the profile name and photo exactly', () => {
    expect(
      reviewAuthor(user, { displayName: 'Ada', photoUrl: 'https://example.com/p.png' }),
    ).toEqual({ uid: 'u1', displayName: 'Ada', photoUrl: 'https://example.com/p.png' });
    expect(reviewAuthor(user, { displayName: 'Ada', photoUrl: null })).toEqual({
      uid: 'u1',
      displayName: 'Ada',
      photoUrl: null,
    });
  });

  it('keeps the profile values untouched, with no trimming or clipping', () => {
    const displayName = ` ${'😀'.repeat(29)}x `;
    const photoUrl = `https://example.com/${'a'.repeat(2000)}`;
    expect(reviewAuthor(user, { displayName, photoUrl })).toEqual({
      uid: 'u1',
      displayName,
      photoUrl,
    });
  });

  it('returns no author while the profile is loading or missing', () => {
    expect(reviewAuthor(user, undefined)).toBeNull();
    expect(reviewAuthor(user, null)).toBeNull();
    expect(reviewAuthor(user, null, 'AI Explore member')).toBeNull();
  });
});
