import { BUNDLE_PERIODS, COLLECTION_ICONS, COLLECTION_LIMITS } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  type DocumentData,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { beforeEach, describe, it } from 'vitest';
import { collectionDoc, newBundleInterest, newCollection, without } from './builders';
import { ALICE, useRules } from './fixtures';
import { paths } from './paths';

const BUNDLE = 'startup-founder-pack';
const toolIds = (count: number) => Array.from({ length: count }, (_, index) => `tool-${index}`);

describe.skip('INV-10: collection and bundle-interest documents reject unknown fields and bad values', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({ [paths.collection(ALICE, 'c1')]: collectionDoc() });
  });

  const collectionData = (changes: DocumentData = {}) => ({ ...newCollection(), ...changes });
  const createCollection = (data: DocumentData) =>
    setDoc(doc(rules.as(ALICE), paths.collection(ALICE, 'c2')), data);
  const updateCollection = (changes: DocumentData) =>
    updateDoc(doc(rules.as(ALICE), paths.collection(ALICE, 'c1')), changes);
  const registerInterest = (data: DocumentData, bundle = BUNDLE) =>
    setDoc(doc(rules.as(ALICE), paths.bundleInterest(ALICE, bundle)), data);

  it('allows a collection at the name and toolIds limits with every allow-listed icon', async () => {
    await assertSucceeds(
      createCollection(
        collectionData({
          name: 'n'.repeat(COLLECTION_LIMITS.nameMax),
          toolIds: toolIds(COLLECTION_LIMITS.toolIdsMax),
          color: 'emerald',
          order: 3,
        }),
      ),
    );
    for (const icon of COLLECTION_ICONS) await assertSucceeds(updateCollection({ icon }));
  });

  it('allows renaming, reordering and refilling a collection', async () => {
    await assertSucceeds(updateCollection({ name: 'Video', order: 2, toolIds: ['runway'] }));
    await assertSucceeds(updateCollection({ toolIds: [] }));
  });

  it('allows bundle interest for every period', async () => {
    for (const period of BUNDLE_PERIODS)
      await assertSucceeds(registerInterest(newBundleInterest(period), `${BUNDLE}-${period}`));
  });

  it('denies a collection name that is empty, blank or over 40 characters', async () => {
    await assertFails(createCollection(collectionData({ name: '' })));
    await assertFails(createCollection(collectionData({ name: '    ' })));
    await assertFails(
      createCollection(collectionData({ name: 'n'.repeat(COLLECTION_LIMITS.nameMax + 1) })),
    );
    await assertFails(updateCollection({ name: ' ' }));
  });

  it('denies more than 50 toolIds or a non-list toolIds', async () => {
    await assertFails(
      createCollection(collectionData({ toolIds: toolIds(COLLECTION_LIMITS.toolIdsMax + 1) })),
    );
    await assertFails(createCollection(collectionData({ toolIds: 'midjourney' })));
    await assertFails(updateCollection({ toolIds: toolIds(COLLECTION_LIMITS.toolIdsMax + 1) }));
  });

  it('denies an icon or colour outside the allow-lists', async () => {
    await assertFails(createCollection(collectionData({ icon: 'skull' })));
    await assertFails(createCollection(collectionData({ color: 'red' })));
    await assertFails(updateCollection({ color: 'crimson' }));
  });

  it('denies an order that is negative or not an integer', async () => {
    await assertFails(createCollection(collectionData({ order: -1 })));
    await assertFails(createCollection(collectionData({ order: 1.5 })));
  });

  it('denies unknown or missing collection fields and a client createdAt', async () => {
    await assertFails(createCollection(collectionData({ shared: true })));
    await assertFails(createCollection(without(collectionData(), 'order')));
    await assertFails(createCollection(collectionData({ createdAt: Timestamp.now() })));
  });

  it('denies a collection update that changes createdAt or adds a field', async () => {
    await assertFails(updateCollection({ createdAt: serverTimestamp() }));
    await assertFails(updateCollection({ shared: true }));
  });

  it('denies a bundle-interest period outside monthly, quarterly and yearly', async () => {
    await assertFails(registerInterest({ period: 'weekly', createdAt: serverTimestamp() }));
    await assertFails(registerInterest({ createdAt: serverTimestamp() }));
  });

  it('denies bundle interest with unknown fields or a client createdAt', async () => {
    await assertFails(registerInterest({ ...newBundleInterest(), email: 'a@b.test' }));
    await assertFails(registerInterest({ period: 'monthly', createdAt: Timestamp.now() }));
  });
});
