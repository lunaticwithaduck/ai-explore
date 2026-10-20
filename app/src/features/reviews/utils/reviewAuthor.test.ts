import { describe, expect, it } from 'vitest';
import { reviewAuthor } from './reviewAuthor';

const user = {
  uid: 'u1',
  email: 'ada.lovelace@example.com',
  displayName: 'Ada from Auth',
  photoUrl: 'https://example.com/auth.png',
};

describe('reviewAuthor', () => {
  it('prefers the profile name and photo', () => {
    expect(
      reviewAuthor(user, { displayName: 'Ada', photoUrl: 'https://example.com/p.png' }, 'Member'),
    ).toEqual({ uid: 'u1', displayName: 'Ada', photoUrl: 'https://example.com/p.png' });
  });

  it('falls back to the auth user, then the email, then the given name', () => {
    expect(reviewAuthor(user, null, 'Member').displayName).toBe('Ada from Auth');
    expect(reviewAuthor({ ...user, displayName: '  ' }, null, 'Member').displayName).toBe(
      'ada.lovelace',
    );
    expect(
      reviewAuthor({ ...user, displayName: null, email: null }, undefined, 'Member').displayName,
    ).toBe('Member');
  });

  it('clips the name to the 60 characters the rules allow', () => {
    const name = reviewAuthor({ ...user, displayName: 'x'.repeat(80) }, null, 'Member');
    expect(name.displayName).toHaveLength(60);
  });

  it('drops a photo the review schema would reject', () => {
    expect(
      reviewAuthor({ ...user, photoUrl: 'not a url' }, { displayName: 'Ada', photoUrl: null }, 'M')
        .photoUrl,
    ).toBeNull();
    expect(
      reviewAuthor({ ...user, photoUrl: `https://example.com/${'a'.repeat(2048)}` }, null, 'M')
        .photoUrl,
    ).toBeNull();
  });
});
