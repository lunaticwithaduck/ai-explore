import { COLLECTIONS } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  bundleInterestDoc,
  collectionDoc,
  newBundleInterest,
  newCollection,
  newProfile,
  profileDoc,
} from './builders';
import { ADMIN, ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const BUNDLE = 'startup-founder-pack';

describe('INV-3: a user reads and writes only their own users/{uid} tree', () => {
  const rules = useRules();

  beforeEach(async () => {
    const tree = (uid: string) => ({
      [paths.user(uid)]: profileDoc(),
      [paths.saved(uid, TOOL)]: { savedAt: new Date('2026-01-15T10:00:00Z') },
      [paths.collection(uid, 'c1')]: collectionDoc(),
      [paths.bundleInterest(uid, BUNDLE)]: bundleInterestDoc(),
    });
    await rules.seed({ [paths.admin(ADMIN)]: {}, ...tree(ALICE), ...tree(BOB) });
  });

  it('allows the owner to read every document of their tree', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(getDoc(doc(db, paths.user(ALICE))));
    await assertSucceeds(getDoc(doc(db, paths.saved(ALICE, TOOL))));
    await assertSucceeds(getDoc(doc(db, paths.collection(ALICE, 'c1'))));
    await assertSucceeds(getDoc(doc(db, paths.bundleInterest(ALICE, BUNDLE))));
    const saved = await assertSucceeds(getDocs(collection(db, paths.savedList(ALICE))));
    expect(saved.size).toBe(1);
    await assertSucceeds(getDocs(collection(db, paths.collectionList(ALICE))));
  });

  it('allows the owner to create their profile', async () => {
    await assertSucceeds(setDoc(doc(rules.as('newcomer'), paths.user('newcomer')), newProfile()));
  });

  it('allows the owner to write their profile, saved tools, collections and interest', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(updateDoc(doc(db, paths.user(ALICE)), { displayName: 'Alice A.' }));
    await assertSucceeds(
      setDoc(doc(db, paths.saved(ALICE, 'chatgpt')), { savedAt: serverTimestamp() }),
    );
    await assertSucceeds(setDoc(doc(db, paths.collection(ALICE, 'c2')), newCollection()));
    await assertSucceeds(updateDoc(doc(db, paths.collection(ALICE, 'c1')), { toolIds: [] }));
    await assertSucceeds(
      setDoc(doc(db, paths.bundleInterest(ALICE, 'solo-agency-stack')), newBundleInterest()),
    );
  });

  it('allows the owner to delete every document of their tree (account deletion)', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(deleteDoc(doc(db, paths.saved(ALICE, TOOL))));
    await assertSucceeds(deleteDoc(doc(db, paths.collection(ALICE, 'c1'))));
    await assertSucceeds(deleteDoc(doc(db, paths.bundleInterest(ALICE, BUNDLE))));
    await assertSucceeds(deleteDoc(doc(db, paths.user(ALICE))));
    expect(await rules.read(paths.user(ALICE))).toBeUndefined();
  });

  it("denies reading another user's documents", async () => {
    const db = rules.as(ALICE);
    await assertFails(getDoc(doc(db, paths.user(BOB))));
    await assertFails(getDoc(doc(db, paths.saved(BOB, TOOL))));
    await assertFails(getDoc(doc(db, paths.collection(BOB, 'c1'))));
    await assertFails(getDoc(doc(db, paths.bundleInterest(BOB, BUNDLE))));
  });

  it("denies listing another user's subcollections", async () => {
    const db = rules.as(ALICE);
    await assertFails(getDocs(collection(db, paths.savedList(BOB))));
    await assertFails(getDocs(collection(db, paths.collectionList(BOB))));
  });

  it('denies listing the users collection', async () => {
    await assertFails(getDocs(collection(rules.as(ALICE), COLLECTIONS.users)));
  });

  it("denies creating another user's profile", async () => {
    await assertFails(setDoc(doc(rules.as(ALICE), paths.user('newcomer')), newProfile()));
  });

  it("denies writing another user's profile, saved tools, collections and interest", async () => {
    const db = rules.as(ALICE);
    await assertFails(updateDoc(doc(db, paths.user(BOB)), { displayName: 'Hijacked' }));
    await assertFails(setDoc(doc(db, paths.saved(BOB, 'chatgpt')), { savedAt: serverTimestamp() }));
    await assertFails(setDoc(doc(db, paths.collection(BOB, 'c2')), newCollection()));
    await assertFails(updateDoc(doc(db, paths.collection(BOB, 'c1')), { toolIds: [] }));
    await assertFails(
      setDoc(doc(db, paths.bundleInterest(BOB, 'solo-agency-stack')), newBundleInterest()),
    );
  });

  it("denies deleting another user's documents", async () => {
    const db = rules.as(ALICE);
    await assertFails(deleteDoc(doc(db, paths.user(BOB))));
    await assertFails(deleteDoc(doc(db, paths.saved(BOB, TOOL))));
    await assertFails(deleteDoc(doc(db, paths.collection(BOB, 'c1'))));
    await assertFails(deleteDoc(doc(db, paths.bundleInterest(BOB, BUNDLE))));
  });

  it("denies an admin reading or writing another user's profile", async () => {
    const db = rules.as(ADMIN);
    await assertFails(getDoc(doc(db, paths.user(ALICE))));
    await assertFails(updateDoc(doc(db, paths.user(ALICE)), { displayName: 'Hijacked' }));
  });

  it('denies a visitor any access to a user tree', async () => {
    const db = rules.visitor();
    await assertFails(getDoc(doc(db, paths.user(ALICE))));
    await assertFails(getDocs(collection(db, paths.savedList(ALICE))));
    await assertFails(
      setDoc(doc(db, paths.saved(ALICE, 'chatgpt')), { savedAt: serverTimestamp() }),
    );
    await assertFails(deleteDoc(doc(db, paths.collection(ALICE, 'c1'))));
  });
});
