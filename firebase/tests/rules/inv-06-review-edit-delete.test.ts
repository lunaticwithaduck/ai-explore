import { REVIEW_LIMITS } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  type DocumentData,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { deleteReview, editReview, ratingDelta, sumDelta } from './batches';
import { reviewDoc, toolDoc } from './builders';
import { ALICE, CAROL, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';

describe('INV-6: editing moves sum by r2 − r1, deleting moves count by −1 and sum by −r', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool(TOOL)]: toolDoc(TOOL, { rating: { count: 2, sum: 7 } }),
      [paths.review(TOOL, ALICE)]: reviewDoc(TOOL, ALICE, 3),
      [paths.review(TOOL, CAROL)]: reviewDoc(TOOL, CAROL, 4),
    });
  });

  const rating = async () => (await rules.read(paths.tool(TOOL)))?.rating;

  const edit = (review: DocumentData, tool?: DocumentData) => {
    const db = rules.as(ALICE);
    const batch = writeBatch(db);
    batch.update(doc(db, paths.review(TOOL, ALICE)), { updatedAt: serverTimestamp(), ...review });
    if (tool) batch.update(doc(db, paths.tool(TOOL)), tool);
    return batch.commit();
  };

  const remove = (tool?: DocumentData) => {
    const db = rules.as(ALICE);
    const batch = writeBatch(db);
    batch.delete(doc(db, paths.review(TOOL, ALICE)));
    if (tool) batch.update(doc(db, paths.tool(TOOL)), tool);
    return batch.commit();
  };

  it('allows raising one’s own rating with sum moved by r2 − r1', async () => {
    await assertSucceeds(editReview(rules.as(ALICE), TOOL, ALICE, 3, 5));
    expect(await rating()).toEqual({ count: 2, sum: 9 });
    expect((await rules.read(paths.review(TOOL, ALICE)))?.rating).toBe(5);
  });

  it('allows lowering one’s own rating with a negative sum delta', async () => {
    await assertSucceeds(editReview(rules.as(ALICE), TOOL, ALICE, 3, 1));
    expect(await rating()).toEqual({ count: 2, sum: 5 });
  });

  it('allows editing only the body without touching the tool', async () => {
    await assertSucceeds(editReview(rules.as(ALICE), TOOL, ALICE, 3, 3));
    await assertSucceeds(edit({ body: '' }));
    expect(await rating()).toEqual({ count: 2, sum: 7 });
  });

  it('allows deleting one’s own review with count −1 and sum −r', async () => {
    await assertSucceeds(deleteReview(rules.as(ALICE), TOOL, ALICE, 3));
    expect(await rating()).toEqual({ count: 1, sum: 4 });
    expect(await rules.read(paths.review(TOOL, ALICE))).toBeUndefined();
  });

  it('denies a rating change without the aggregate change', async () => {
    await assertFails(edit({ rating: 5 }));
  });

  it('denies a rating change with a wrong sum delta', async () => {
    await assertFails(edit({ rating: 5 }, sumDelta(1)));
    await assertFails(edit({ rating: 5 }, sumDelta(5)));
    await assertFails(edit({ rating: 3, body: 'Same rating.' }, sumDelta(1)));
  });

  it('denies an edit that also changes count', async () => {
    await assertFails(edit({ rating: 5 }, ratingDelta(1, 2)));
    await assertFails(edit({ rating: 5 }, ratingDelta(-1, 2)));
  });

  it('denies an edit to a rating outside 1 to 5 or a body over the maximum', async () => {
    await assertFails(edit({ rating: REVIEW_LIMITS.ratingMax + 1 }, sumDelta(3)));
    await assertFails(edit({ rating: REVIEW_LIMITS.ratingMin - 1 }, sumDelta(-3)));
    await assertFails(edit({ body: 'x'.repeat(REVIEW_LIMITS.bodyMax + 1) }));
  });

  it('denies changing toolId, authorUid, helpfulCount or createdAt', async () => {
    await assertFails(edit({ toolId: 'chatgpt' }));
    await assertFails(edit({ authorUid: CAROL }));
    await assertFails(edit({ helpfulCount: 5 }));
    await assertFails(edit({ createdAt: serverTimestamp() }));
  });

  it('denies a client timestamp for updatedAt and unknown fields', async () => {
    await assertFails(edit({ body: 'New.', updatedAt: Timestamp.now() }));
    await assertFails(edit({ body: 'New.', verified: true }));
  });

  it('denies deleting a review without the aggregate change', async () => {
    await assertFails(deleteDoc(doc(rules.as(ALICE), paths.review(TOOL, ALICE))));
  });

  it('denies deleting a review with wrong deltas', async () => {
    await assertFails(remove(ratingDelta(-1, -2)));
    await assertFails(remove(ratingDelta(-2, -3)));
    await assertFails(remove(ratingDelta(0, -3)));
    await assertFails(remove(sumDelta(-3)));
  });

  it('denies an aggregate decrement without deleting the review', async () => {
    await assertFails(updateDoc(doc(rules.as(ALICE), paths.tool(TOOL)), ratingDelta(-1, -3)));
    await assertFails(updateDoc(doc(rules.as(ALICE), paths.tool(TOOL)), sumDelta(2)));
  });
});
