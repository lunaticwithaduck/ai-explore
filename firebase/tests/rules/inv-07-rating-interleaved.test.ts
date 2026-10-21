import { assertSucceeds } from '@firebase/rules-unit-testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { concurrently, createReview, deleteReview, editReview } from './batches';
import { authorProfileDoc, toolDoc } from './builders';
import { ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';

describe('INV-7: interleaved and concurrent review batches keep the aggregate exact', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool(TOOL)]: toolDoc(TOOL),
      [paths.user(ALICE)]: authorProfileDoc(ALICE),
      [paths.user(BOB)]: authorProfileDoc(BOB),
    });
  });

  const expectAggregateMatchesReviews = async (expected: { count: number; sum: number }) => {
    const reviews = await rules.readAll(paths.reviews(TOOL));
    const remaining = {
      count: reviews.length,
      sum: reviews.reduce((total, review) => total + Number(review.rating), 0),
    };
    expect(remaining).toEqual(expected);
    expect((await rules.read(paths.tool(TOOL)))?.rating).toEqual(remaining);
  };

  it('allows several interleaved rounds and leaves sum and count equal to the reviews', async () => {
    const alice = rules.as(ALICE);
    const bob = rules.as(BOB);

    await assertSucceeds(
      concurrently(createReview(alice, TOOL, ALICE, 4), createReview(bob, TOOL, BOB, 2)),
    );
    await expectAggregateMatchesReviews({ count: 2, sum: 6 });

    await assertSucceeds(editReview(alice, TOOL, ALICE, 4, 1));
    await assertSucceeds(deleteReview(bob, TOOL, BOB, 2));
    await expectAggregateMatchesReviews({ count: 1, sum: 1 });

    await assertSucceeds(
      concurrently(createReview(bob, TOOL, BOB, 5), editReview(alice, TOOL, ALICE, 1, 3)),
    );
    await expectAggregateMatchesReviews({ count: 2, sum: 8 });

    await assertSucceeds(
      concurrently(deleteReview(alice, TOOL, ALICE, 3), editReview(bob, TOOL, BOB, 5, 4)),
    );
    await expectAggregateMatchesReviews({ count: 1, sum: 4 });

    await assertSucceeds(createReview(alice, TOOL, ALICE, 2));
    await assertSucceeds(deleteReview(bob, TOOL, BOB, 4));
    await expectAggregateMatchesReviews({ count: 1, sum: 2 });

    await assertSucceeds(deleteReview(alice, TOOL, ALICE, 2));
    await assertSucceeds(
      concurrently(createReview(alice, TOOL, ALICE, 5), createReview(bob, TOOL, BOB, 3)),
    );
    await expectAggregateMatchesReviews({ count: 2, sum: 8 });
  });

  it('allows two concurrent create batches without losing either increment', async () => {
    await assertSucceeds(
      concurrently(
        createReview(rules.as(ALICE), TOOL, ALICE, 5),
        createReview(rules.as(BOB), TOOL, BOB, 1),
      ),
    );
    await expectAggregateMatchesReviews({ count: 2, sum: 6 });
  });
});
