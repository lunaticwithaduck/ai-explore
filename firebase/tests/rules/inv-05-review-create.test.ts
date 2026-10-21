import { DISPLAY_NAME_MAX, REVIEW_LIMITS } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  type DocumentData,
  doc,
  increment,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { createReview, ratingDelta, sumDelta } from './batches';
import { authorProfileDoc, newReview, reviewDoc, toolDoc, without } from './builders';
import { ALICE, BOB, CAROL, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const OTHER_TOOL = 'chatgpt';

describe('INV-5: a review is created only together with its rating aggregate', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool(TOOL)]: toolDoc(TOOL, { rating: { count: 1, sum: 4 } }),
      [paths.tool(OTHER_TOOL)]: toolDoc(OTHER_TOOL),
      [paths.user(ALICE)]: authorProfileDoc(ALICE),
      [paths.user(BOB)]: authorProfileDoc(BOB),
      [paths.review(TOOL, CAROL)]: reviewDoc(TOOL, CAROL, 4),
    });
  });

  const review = (changes: DocumentData = {}) => ({ ...newReview(TOOL, ALICE, 5), ...changes });
  const create = (body: DocumentData, delta = ratingDelta(1, 5)) =>
    createReview(rules.as(ALICE), TOOL, ALICE, 5, body, delta);

  it('allows the review and the matching aggregate change in one batch', async () => {
    await assertSucceeds(createReview(rules.as(ALICE), TOOL, ALICE, 5));
    expect((await rules.read(paths.tool(TOOL)))?.rating).toEqual({ count: 2, sum: 9 });
    expect((await rules.read(paths.review(TOOL, ALICE)))?.authorUid).toBe(ALICE);
  });

  it('allows the lowest rating, an empty body and a null photo', async () => {
    await rules.seed({ [paths.user(ALICE)]: authorProfileDoc(ALICE, null) });
    const body = { ...newReview(TOOL, ALICE, 1), body: '', authorPhotoUrl: null };
    await assertSucceeds(createReview(rules.as(ALICE), TOOL, ALICE, 1, body));
    expect((await rules.read(paths.tool(TOOL)))?.rating).toEqual({ count: 2, sum: 5 });
  });

  it('allows a body of exactly the maximum length and a bg locale', async () => {
    await assertSucceeds(create(review({ body: 'x'.repeat(REVIEW_LIMITS.bodyMax), locale: 'bg' })));
  });

  it('denies a review without the aggregate change', async () => {
    await assertFails(setDoc(doc(rules.as(ALICE), paths.review(TOOL, ALICE)), review()));
  });

  it('denies an aggregate change without the review', async () => {
    await assertFails(updateDoc(doc(rules.as(ALICE), paths.tool(TOOL)), ratingDelta(1, 5)));
  });

  it('denies a count change other than +1', async () => {
    await assertFails(create(review(), ratingDelta(2, 5)));
    await assertFails(create(review(), ratingDelta(0, 5)));
    await assertFails(create(review(), sumDelta(5)));
  });

  it('denies a sum change other than the rating', async () => {
    await assertFails(create(review(), ratingDelta(1, 4)));
    await assertFails(create(review(), ratingDelta(1, 6)));
    await assertFails(create(review(), { 'rating.count': increment(1) }));
  });

  it('denies a rating outside the integers 1 to 5', async () => {
    const db = rules.as(ALICE);
    for (const rating of [REVIEW_LIMITS.ratingMin - 1, REVIEW_LIMITS.ratingMax + 1, 3.5])
      await assertFails(
        createReview(db, TOOL, ALICE, rating, review({ rating }), ratingDelta(1, rating)),
      );
    await assertFails(create(review({ rating: '5' })));
  });

  it('denies a body longer than the maximum', async () => {
    await assertFails(create(review({ body: 'x'.repeat(REVIEW_LIMITS.bodyMax + 1) })));
  });

  it('denies an authorName outside 1 to 60 characters and a non-string photo', async () => {
    await assertFails(create(review({ authorName: '' })));
    await assertFails(create(review({ authorName: 'n'.repeat(DISPLAY_NAME_MAX + 1) })));
    await assertFails(create(review({ authorPhotoUrl: 42 })));
  });

  it('denies a locale other than en or bg', async () => {
    await assertFails(create(review({ locale: 'de' })));
  });

  it('denies a non-zero helpfulCount', async () => {
    await assertFails(create(review({ helpfulCount: 1 })));
  });

  it('denies client timestamps for createdAt or updatedAt', async () => {
    await assertFails(create(review({ createdAt: Timestamp.now() })));
    await assertFails(create(review({ updatedAt: Timestamp.now() })));
  });

  it('denies a toolId that differs from the path or an authorUid that is not the caller', async () => {
    await assertFails(create(review({ toolId: OTHER_TOOL })));
    await assertFails(create(review({ authorUid: BOB })));
  });

  it('denies unknown and missing fields', async () => {
    await assertFails(create(review({ verified: true })));
    await assertFails(create(without(review(), 'locale')));
    await assertFails(create(without(review(), 'body')));
  });

  it('denies a tool update that touches any key other than rating', async () => {
    await assertFails(create(review(), { ...ratingDelta(1, 5), name: 'Hijacked' }));
    await assertFails(create(review(), { ...ratingDelta(1, 5), published: false }));
  });

  it('denies a visitor creating a review', async () => {
    const db = rules.visitor();
    await assertFails(createReview(db, TOOL, ALICE, 5));
  });
});
