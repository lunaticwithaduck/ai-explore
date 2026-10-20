import { SUBCOLLECTIONS } from '@ai-explore/schemas';
import { assertSucceeds } from '@firebase/rules-unit-testing';
import { collectionGroup, getDocs, orderBy, query, where } from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { reviewDoc, toolDoc } from './builders';
import { ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

describe.skip('INV-1: reviews are readable as a collection group by author', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.tool('midjourney')]: toolDoc('midjourney'),
      [paths.tool('chatgpt')]: toolDoc('chatgpt'),
      [paths.review('midjourney', ALICE)]: reviewDoc('midjourney', ALICE, 5),
      [paths.review('chatgpt', ALICE)]: reviewDoc('chatgpt', ALICE, 3),
      [paths.review('chatgpt', BOB)]: reviewDoc('chatgpt', BOB, 4),
    });
  });

  const byAuthor = (uid: string) =>
    query(
      collectionGroup(rules.as(uid), SUBCOLLECTIONS.reviews),
      where('authorUid', '==', uid),
      orderBy('updatedAt', 'desc'),
    );

  it('allows a user to list their own reviews across tools', async () => {
    const snap = await assertSucceeds(getDocs(byAuthor(ALICE)));
    expect(snap.docs.map((d) => d.data().toolId).sort()).toEqual(['chatgpt', 'midjourney']);
  });

  it('allows a visitor to list reviews by author for public profiles', async () => {
    const snap = await assertSucceeds(
      getDocs(
        query(
          collectionGroup(rules.visitor(), SUBCOLLECTIONS.reviews),
          where('authorUid', '==', BOB),
        ),
      ),
    );
    expect(snap.size).toBe(1);
  });
});
