import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  collection,
  type DocumentData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { castVote, withdrawVote } from './batches';
import { reviewDoc, toolDoc } from './builders';
import { ALICE, BOB, CAROL, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const VOTED_AT = new Date('2026-01-16T10:00:00Z');

describe.skip('INV-9: one helpful vote per voter, paired with helpfulCount ±1', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool(TOOL)]: toolDoc(TOOL, { rating: { count: 2, sum: 9 } }),
      [paths.review(TOOL, BOB)]: reviewDoc(TOOL, BOB, 4),
      [paths.review(TOOL, CAROL)]: reviewDoc(TOOL, CAROL, 5, { helpfulCount: 1 }),
      [paths.vote(TOOL, CAROL, ALICE)]: { createdAt: VOTED_AT },
    });
  });

  const helpful = async (author: string) =>
    (await rules.read(paths.review(TOOL, author)))?.helpfulCount;

  const voteWith = (voteDoc: DocumentData, voterId = ALICE, delta = 1) => {
    const db = rules.as(ALICE);
    const batch = writeBatch(db);
    batch.set(doc(db, paths.vote(TOOL, BOB, voterId)), voteDoc);
    batch.update(doc(db, paths.review(TOOL, BOB)), { helpfulCount: increment(delta) });
    return batch.commit();
  };

  it('allows voting on another user’s review with helpfulCount +1', async () => {
    await assertSucceeds(castVote(rules.as(ALICE), TOOL, BOB, ALICE));
    expect(await helpful(BOB)).toBe(1);
  });

  it('allows withdrawing one’s vote with helpfulCount −1', async () => {
    await assertSucceeds(withdrawVote(rules.as(ALICE), TOOL, CAROL, ALICE));
    expect(await helpful(CAROL)).toBe(0);
    expect(await rules.read(paths.vote(TOOL, CAROL, ALICE))).toBeUndefined();
  });

  it('allows anyone to read reviews and votes', async () => {
    const db = rules.visitor();
    await assertSucceeds(getDoc(doc(db, paths.review(TOOL, CAROL))));
    await assertSucceeds(getDoc(doc(db, paths.vote(TOOL, CAROL, ALICE))));
    const votes = await assertSucceeds(getDocs(collection(db, paths.votes(TOOL, CAROL))));
    expect(votes.size).toBe(1);
  });

  it('denies voting on one’s own review', async () => {
    await assertFails(castVote(rules.as(BOB), TOOL, BOB, BOB));
  });

  it('denies a second vote on the same review', async () => {
    await assertFails(castVote(rules.as(ALICE), TOOL, CAROL, ALICE));
    expect(await helpful(CAROL)).toBe(1);
  });

  it('denies a vote without the helpfulCount change', async () => {
    await assertFails(
      setDoc(doc(rules.as(ALICE), paths.vote(TOOL, BOB, ALICE)), { createdAt: serverTimestamp() }),
    );
  });

  it('denies a helpfulCount change without the vote', async () => {
    const db = rules.as(ALICE);
    await assertFails(updateDoc(doc(db, paths.review(TOOL, BOB)), { helpfulCount: increment(1) }));
    await assertFails(
      updateDoc(doc(db, paths.review(TOOL, CAROL)), { helpfulCount: increment(-1) }),
    );
  });

  it('denies withdrawing a vote without the helpfulCount change', async () => {
    await assertFails(deleteDoc(doc(rules.as(ALICE), paths.vote(TOOL, CAROL, ALICE))));
  });

  it('denies helpfulCount deltas other than ±1', async () => {
    await assertFails(voteWith({ createdAt: serverTimestamp() }, ALICE, 2));
    await assertFails(voteWith({ createdAt: serverTimestamp() }, ALICE, 0));
    await assertFails(withdrawVote(rules.as(ALICE), TOOL, CAROL, ALICE, -2));
  });

  it('denies a vote doc id that differs from the voter uid', async () => {
    await assertFails(voteWith({ createdAt: serverTimestamp() }, CAROL));
  });

  it('denies unknown fields and a client timestamp on the vote', async () => {
    await assertFails(voteWith({ createdAt: serverTimestamp(), weight: 5 }));
    await assertFails(voteWith({ createdAt: Timestamp.now() }));
  });

  it('denies a voter changing any other review field', async () => {
    const db = rules.as(ALICE);
    const batch = writeBatch(db);
    batch.set(doc(db, paths.vote(TOOL, BOB, ALICE)), { createdAt: serverTimestamp() });
    batch.update(doc(db, paths.review(TOOL, BOB)), { helpfulCount: increment(1), rating: 1 });
    await assertFails(batch.commit());
  });

  it('denies a visitor voting', async () => {
    await assertFails(castVote(rules.visitor(), TOOL, BOB, ALICE));
  });
});
