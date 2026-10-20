import { SUBCOLLECTIONS } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { bundleInterestDoc, newBundleInterest } from './builders';
import { ADMIN, ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

const BUNDLE = 'startup-founder-pack';
const OTHER_BUNDLE = 'ai-sdr-bundle';

describe.skip('INV-12: bundleInterest is owner-write and admin-only as a collection group', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.admin(ADMIN)]: {},
      [paths.bundleInterest(ALICE, BUNDLE)]: bundleInterestDoc('monthly'),
      [paths.bundleInterest(BOB, OTHER_BUNDLE)]: bundleInterestDoc('yearly'),
    });
  });

  const interestGroup = () => collectionGroup(rules.as(ALICE), SUBCOLLECTIONS.bundleInterest);

  it('allows an admin to read bundleInterest as a collection group', async () => {
    const db = rules.as(ADMIN);
    const all = await assertSucceeds(getDocs(collectionGroup(db, SUBCOLLECTIONS.bundleInterest)));
    expect(all.size).toBe(2);
    const yearly = await assertSucceeds(
      getDocs(
        query(collectionGroup(db, SUBCOLLECTIONS.bundleInterest), where('period', '==', 'yearly')),
      ),
    );
    expect(yearly.docs.map((snap) => snap.ref.path)).toEqual([
      paths.bundleInterest(BOB, OTHER_BUNDLE),
    ]);
  });

  it('allows the owner to register, read and withdraw their interest', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(
      setDoc(doc(db, paths.bundleInterest(ALICE, OTHER_BUNDLE)), newBundleInterest('quarterly')),
    );
    await assertSucceeds(getDoc(doc(db, paths.bundleInterest(ALICE, OTHER_BUNDLE))));
    await assertSucceeds(deleteDoc(doc(db, paths.bundleInterest(ALICE, BUNDLE))));
  });

  it('denies a signed-in non-admin the collection-group read', async () => {
    await assertFails(getDocs(interestGroup()));
    await assertFails(getDocs(query(interestGroup(), where('period', '==', 'monthly'))));
  });

  it('denies a visitor the collection-group read', async () => {
    await assertFails(getDocs(collectionGroup(rules.visitor(), SUBCOLLECTIONS.bundleInterest)));
  });

  it("denies writing another user's bundleInterest, even as an admin", async () => {
    await assertFails(
      setDoc(doc(rules.as(BOB), paths.bundleInterest(ALICE, OTHER_BUNDLE)), newBundleInterest()),
    );
    await assertFails(
      setDoc(doc(rules.as(ADMIN), paths.bundleInterest(ALICE, OTHER_BUNDLE)), newBundleInterest()),
    );
    await assertFails(deleteDoc(doc(rules.as(ADMIN), paths.bundleInterest(ALICE, BUNDLE))));
  });
});
