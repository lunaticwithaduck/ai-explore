import { COLLECTIONS } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  type Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { profileDoc, subscriptionDoc } from './builders';
import { ADMIN, ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

const BUNDLE = 'startup-founder-pack';

describe.skip('INV-4: no client writes admins/* or users/*/subscriptions/*', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.admin(ADMIN)]: {},
      [paths.user(ALICE)]: profileDoc(),
      [paths.subscription(ALICE, 'sub-1')]: subscriptionDoc(BUNDLE),
    });
  });

  const everyClient = (): Firestore[] => [
    rules.as(ALICE),
    rules.as(BOB),
    rules.as(ADMIN),
    rules.visitor(),
  ];

  it('allows a user to read their own subscriptions', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(getDoc(doc(db, paths.subscription(ALICE, 'sub-1'))));
    const snap = await assertSucceeds(getDocs(collection(db, paths.subscriptionList(ALICE))));
    expect(snap.size).toBe(1);
  });

  it('allows an admin to read their own admins doc', async () => {
    const snap = await assertSucceeds(getDoc(doc(rules.as(ADMIN), paths.admin(ADMIN))));
    expect(snap.exists()).toBe(true);
  });

  it('allows a non-admin to read their own (missing) admins doc', async () => {
    const snap = await assertSucceeds(getDoc(doc(rules.as(ALICE), paths.admin(ALICE))));
    expect(snap.exists()).toBe(false);
  });

  it("denies reading another user's admins doc", async () => {
    await assertFails(getDoc(doc(rules.as(ALICE), paths.admin(ADMIN))));
    await assertFails(getDoc(doc(rules.visitor(), paths.admin(ADMIN))));
  });

  it('denies listing the admins collection', async () => {
    await assertFails(getDocs(collection(rules.as(ALICE), COLLECTIONS.admins)));
    await assertFails(getDocs(collection(rules.as(ADMIN), COLLECTIONS.admins)));
  });

  it("denies reading another user's subscriptions", async () => {
    await assertFails(getDoc(doc(rules.as(BOB), paths.subscription(ALICE, 'sub-1'))));
    await assertFails(getDocs(collection(rules.as(BOB), paths.subscriptionList(ALICE))));
    await assertFails(getDoc(doc(rules.as(ADMIN), paths.subscription(ALICE, 'sub-1'))));
  });

  it('denies every client creating an admins doc, including for themselves', async () => {
    await assertFails(setDoc(doc(rules.as(ALICE), paths.admin(ALICE)), {}));
    await assertFails(setDoc(doc(rules.as(ADMIN), paths.admin(BOB)), {}));
    await assertFails(setDoc(doc(rules.visitor(), paths.admin('anyone')), {}));
  });

  it('denies every client editing or deleting an admins doc', async () => {
    for (const db of everyClient()) {
      await assertFails(setDoc(doc(db, paths.admin(ADMIN)), { revoked: true }));
      await assertFails(deleteDoc(doc(db, paths.admin(ADMIN))));
    }
  });

  it('denies every client creating a subscription', async () => {
    for (const db of everyClient())
      await assertFails(
        setDoc(doc(db, paths.subscription(ALICE, 'sub-2')), subscriptionDoc('ai-sdr-bundle')),
      );
  });

  it('denies every client editing a subscription', async () => {
    for (const db of everyClient())
      await assertFails(
        updateDoc(doc(db, paths.subscription(ALICE, 'sub-1')), { status: 'canceled' }),
      );
  });

  it('denies every client deleting a subscription', async () => {
    for (const db of everyClient())
      await assertFails(deleteDoc(doc(db, paths.subscription(ALICE, 'sub-1'))));
  });
});
