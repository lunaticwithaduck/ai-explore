import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';
import { beforeEach, describe, it } from 'vitest';
import { createReview, withdrawVote } from './batches';
import { newCollection, newProfile, newReview, reviewDoc, toolDoc } from './builders';
import { ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const LONG_URL = `https://example.com/${'a'.repeat(2100)}.png`;

describe('R2: rules hardening', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool(TOOL)]: toolDoc(TOOL, { rating: { count: 1, sum: 4 } }),
      [paths.review(TOOL, ALICE)]: reviewDoc(TOOL, ALICE, 4, { helpfulCount: 0 }),
      [paths.vote(TOOL, ALICE, BOB)]: { createdAt: new Date('2026-01-16T10:00:00Z') },
    });
  });

  it('denies withdrawing an orphaned vote that would push helpfulCount below zero', async () => {
    await assertFails(withdrawVote(rules.as(BOB), TOOL, ALICE, BOB));
  });

  it('denies a profile photoUrl longer than 2048 characters', async () => {
    const db = rules.as(ALICE);
    await assertFails(setDoc(doc(db, paths.user(ALICE)), { ...newProfile(), photoUrl: LONG_URL }));
  });

  it('allows a normal profile photoUrl', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(
      setDoc(doc(db, paths.user(ALICE)), {
        ...newProfile(),
        photoUrl: 'https://example.com/a.png',
      }),
    );
  });

  it('denies a review authorPhotoUrl longer than 2048 characters', async () => {
    await assertFails(
      createReview(rules.as(BOB), TOOL, BOB, 5, {
        ...newReview(TOOL, BOB, 5),
        authorPhotoUrl: LONG_URL,
      }),
    );
  });

  it('denies collection toolIds entries that are not slugs', async () => {
    const db = rules.as(ALICE);
    await assertFails(
      setDoc(doc(db, paths.collection(ALICE, 'c1')), { ...newCollection(), toolIds: [42] }),
    );
    await assertFails(
      setDoc(doc(db, paths.collection(ALICE, 'c2')), {
        ...newCollection(),
        toolIds: ['x'.repeat(65)],
      }),
    );
    await assertFails(
      setDoc(doc(db, paths.collection(ALICE, 'c3')), {
        ...newCollection(),
        toolIds: ['Not A Slug'],
      }),
    );
  });

  it('allows slug toolIds in a collection', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(
      setDoc(doc(db, paths.collection(ALICE, 'c4')), {
        ...newCollection(),
        toolIds: ['midjourney', 'github-copilot'],
      }),
    );
  });
});
