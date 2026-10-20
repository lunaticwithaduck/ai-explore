import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { createReview, deleteReview, editReview, ratingDelta } from './batches';
import { newReview, reviewDoc, toolDoc } from './builders';
import { ALICE, BOB, CAROL, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const OTHER_TOOL = 'chatgpt';

describe('INV-8: no writing another user’s review, no second review per tool', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool(TOOL)]: toolDoc(TOOL, { rating: { count: 1, sum: 4 } }),
      [paths.tool(OTHER_TOOL)]: toolDoc(OTHER_TOOL),
      [paths.review(TOOL, BOB)]: reviewDoc(TOOL, BOB, 4),
    });
  });

  it('allows a different user to add their own review to the same tool', async () => {
    await assertSucceeds(createReview(rules.as(ALICE), TOOL, ALICE, 2));
    expect((await rules.read(paths.tool(TOOL)))?.rating).toEqual({ count: 2, sum: 6 });
  });

  it('allows the same user to review a different tool', async () => {
    await assertSucceeds(createReview(rules.as(BOB), OTHER_TOOL, BOB, 5));
    expect((await rules.read(paths.tool(OTHER_TOOL)))?.rating).toEqual({ count: 1, sum: 5 });
  });

  it('denies creating a review under another user’s id', async () => {
    const db = rules.as(ALICE);
    await assertFails(createReview(db, TOOL, CAROL, 3, newReview(TOOL, CAROL, 3)));
    await assertFails(createReview(db, TOOL, CAROL, 3, newReview(TOOL, ALICE, 3)));
  });

  it('denies editing another user’s review', async () => {
    await assertFails(editReview(rules.as(ALICE), TOOL, BOB, 4, 1));
  });

  it('denies deleting another user’s review', async () => {
    await assertFails(deleteReview(rules.as(ALICE), TOOL, BOB, 4));
  });

  it('denies a second review on the same tool', async () => {
    await assertFails(createReview(rules.as(BOB), TOOL, BOB, 5));
    await assertFails(createReview(rules.as(BOB), TOOL, BOB, 4));
  });

  it('denies overwriting one’s review with a fresh create without the aggregate', async () => {
    await assertFails(setDoc(doc(rules.as(BOB), paths.review(TOOL, BOB)), newReview(TOOL, BOB, 4)));
  });

  it('denies a second review smuggled through a batch that also edits the aggregate', async () => {
    const db = rules.as(BOB);
    const batch = writeBatch(db);
    batch.set(doc(db, paths.review(TOOL, BOB)), newReview(TOOL, BOB, 5));
    batch.update(doc(db, paths.tool(TOOL)), ratingDelta(0, 1));
    await assertFails(batch.commit());
    expect((await rules.read(paths.tool(TOOL)))?.rating).toEqual({ count: 1, sum: 4 });
  });
});
