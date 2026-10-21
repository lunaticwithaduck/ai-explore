import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { type DocumentData, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { createReview, editReview } from './batches';
import { authorProfileDoc, newProfile, newReview, reviewDoc, toolDoc } from './builders';
import { ALICE, BOB, CAROL, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const NEWCOMER = 'newcomer';
const PHOTO = 'https://example.com/avatar.png';
const TRACKER = 'https://tracker.example/pixel.gif?u=1';

describe('R3: review author fields mirror the author profile', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool(TOOL)]: toolDoc(TOOL, { rating: { count: 2, sum: 7 } }),
      [paths.user(ALICE)]: authorProfileDoc(ALICE),
      [paths.user(BOB)]: authorProfileDoc(BOB),
      [paths.review(TOOL, BOB)]: reviewDoc(TOOL, BOB, 4, { authorPhotoUrl: PHOTO }),
      [paths.review(TOOL, CAROL)]: reviewDoc(TOOL, CAROL, 3),
    });
  });

  const setProfile = (uid: string, changes: DocumentData) =>
    rules.seed({ [paths.user(uid)]: { ...authorProfileDoc(uid), ...changes } });
  const create = (changes: DocumentData = {}) =>
    createReview(rules.as(ALICE), TOOL, ALICE, 5, { ...newReview(TOOL, ALICE, 5), ...changes });
  const edit = (uid: string, changes: DocumentData) =>
    updateDoc(doc(rules.as(uid), paths.review(TOOL, uid)), {
      updatedAt: serverTimestamp(),
      ...changes,
    });
  const rating = async () => (await rules.read(paths.tool(TOOL)))?.rating;

  describe('create', () => {
    it('allows a review whose name and photo equal the profile', async () => {
      await assertSucceeds(create());
      const review = await rules.read(paths.review(TOOL, ALICE));
      expect(review?.authorName).toBe(`User ${ALICE}`);
      expect(review?.authorPhotoUrl).toBe(PHOTO);
    });

    it('allows a null photo when the profile has none', async () => {
      await setProfile(ALICE, { photoUrl: null });
      await assertSucceeds(create({ authorPhotoUrl: null }));
    });

    it('denies a name that differs from the profile', async () => {
      await assertFails(create({ authorName: 'AI Explore Team ✔' }));
      await assertFails(create({ authorName: `User ${ALICE} ` }));
      expect(await rating()).toEqual({ count: 2, sum: 7 });
    });

    it('denies a photo that differs from the profile', async () => {
      await assertFails(create({ authorPhotoUrl: TRACKER }));
      await assertFails(create({ authorPhotoUrl: null }));
      await setProfile(ALICE, { photoUrl: null });
      await assertFails(create({ authorPhotoUrl: PHOTO }));
      await assertFails(create({ authorPhotoUrl: 'not a url at all' }));
    });

    it('denies a review when the author has no profile', async () => {
      await assertFails(createReview(rules.as(NEWCOMER), TOOL, NEWCOMER, 5));
      await assertFails(
        createReview(rules.as(NEWCOMER), TOOL, NEWCOMER, 5, {
          ...newReview(TOOL, NEWCOMER, 5),
          authorPhotoUrl: null,
        }),
      );
      expect(await rating()).toEqual({ count: 2, sum: 7 });
    });
  });

  describe('edit', () => {
    it('allows an edit that keeps the name and photo', async () => {
      await assertSucceeds(editReview(rules.as(BOB), TOOL, BOB, 4, 2));
      expect(await rating()).toEqual({ count: 2, sum: 5 });
    });

    it('allows an unchanged-fields edit after the author renames', async () => {
      await setProfile(BOB, { displayName: 'Bobby', photoUrl: null });
      await assertSucceeds(editReview(rules.as(BOB), TOOL, BOB, 4, 5));
      const review = await rules.read(paths.review(TOOL, BOB));
      expect(review?.authorName).toBe(`User ${BOB}`);
      expect(review?.authorPhotoUrl).toBe(PHOTO);
    });

    it('allows an edit whose name and photo equal the renamed profile', async () => {
      await setProfile(BOB, { displayName: 'Bobby', photoUrl: 'https://example.com/bobby.png' });
      await assertSucceeds(
        edit(BOB, { authorName: 'Bobby', authorPhotoUrl: 'https://example.com/bobby.png' }),
      );
      expect((await rules.read(paths.review(TOOL, BOB)))?.authorName).toBe('Bobby');
    });

    it('denies an edit that sets a name or photo the profile does not have', async () => {
      await assertFails(edit(BOB, { authorName: 'AI Explore Team ✔' }));
      await assertFails(edit(BOB, { authorPhotoUrl: TRACKER }));
      await assertFails(edit(BOB, { authorPhotoUrl: null }));
      await setProfile(BOB, { displayName: 'Bobby' });
      await assertFails(edit(BOB, { authorName: 'Bobbie' }));
      await assertFails(edit(BOB, { authorName: 'Bobby', authorPhotoUrl: null }));
    });

    it('denies changing the author fields when the author has no profile', async () => {
      await assertFails(edit(CAROL, { authorName: 'Carol' }));
      await assertFails(edit(CAROL, { authorPhotoUrl: PHOTO }));
    });
  });

  describe('profile photo', () => {
    const createProfile = (photoUrl: unknown) =>
      setDoc(doc(rules.as(NEWCOMER), paths.user(NEWCOMER)), { ...newProfile(), photoUrl });
    const updatePhoto = (photoUrl: unknown) =>
      updateDoc(doc(rules.as(ALICE), paths.user(ALICE)), { photoUrl });

    it('denies a photo that is not an https URL', async () => {
      for (const photoUrl of [
        'http://example.com/a.png',
        'not a url',
        'javascript:alert(1)',
        'data:image/png;base64,AAAA',
        'https://',
        'https://example.com/a b.png',
        ' https://example.com/a.png',
        'HTTPS://example.com/a.png',
      ]) {
        await assertFails(createProfile(photoUrl));
        await assertFails(updatePhoto(photoUrl));
      }
    });

    it('allows an https photo or null on create and update', async () => {
      await assertSucceeds(createProfile('https://lh3.googleusercontent.com/a/ACg8ocK=s96-c'));
      await assertSucceeds(updatePhoto('https://example.com/new.png'));
      await assertSucceeds(updatePhoto(null));
    });
  });
});
