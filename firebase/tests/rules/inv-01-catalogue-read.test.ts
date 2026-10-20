import { COLLECTIONS, SUBCOLLECTIONS } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { bundleDoc, categoryDoc, reviewDoc, toolDoc, toolUpdateDoc } from './builders';
import { ADMIN, ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const OTHER_TOOL = 'chatgpt';
const DRAFT_TOOL = 'draft-tool';
const BUNDLE = 'startup-founder-pack';
const DRAFT_BUNDLE = 'draft-bundle';

describe('INV-1: visitors read the published catalogue, never drafts', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.admin(ADMIN)]: {},
      [paths.category('image')]: categoryDoc(),
      [paths.tool(TOOL)]: toolDoc(TOOL),
      [paths.tool(OTHER_TOOL)]: toolDoc(OTHER_TOOL),
      [paths.tool(DRAFT_TOOL)]: toolDoc(DRAFT_TOOL, { published: false }),
      [paths.update(TOOL, 'v7')]: toolUpdateDoc(TOOL),
      [paths.update(OTHER_TOOL, 'v5')]: toolUpdateDoc(OTHER_TOOL),
      [paths.review(TOOL, BOB)]: reviewDoc(TOOL, BOB, 4),
      [paths.bundle(BUNDLE)]: bundleDoc(BUNDLE),
      [paths.bundle(DRAFT_BUNDLE)]: bundleDoc(DRAFT_BUNDLE, { published: false }),
      [paths.appConfig]: { checkoutEnabled: false },
    });
  });

  const publishedOnly = () => where('published', '==', true);

  it('allows a visitor to get a published tool, a category, an update and config/app', async () => {
    const db = rules.visitor();
    await assertSucceeds(getDoc(doc(db, paths.tool(TOOL))));
    await assertSucceeds(getDoc(doc(db, paths.category('image'))));
    await assertSucceeds(getDoc(doc(db, paths.update(TOOL, 'v7'))));
    await assertSucceeds(getDoc(doc(db, paths.appConfig)));
  });

  it('allows a visitor to get a published bundle', async () => {
    await assertSucceeds(getDoc(doc(rules.visitor(), paths.bundle(BUNDLE))));
  });

  it('allows a visitor to get and list the reviews of a tool', async () => {
    const db = rules.visitor();
    await assertSucceeds(getDoc(doc(db, paths.review(TOOL, BOB))));
    const snap = await assertSucceeds(getDocs(collection(db, paths.reviews(TOOL))));
    expect(snap.size).toBe(1);
  });

  it('allows a visitor to list categories and the updates of a tool', async () => {
    const db = rules.visitor();
    await assertSucceeds(getDocs(collection(db, COLLECTIONS.categories)));
    await assertSucceeds(getDocs(collection(db, paths.tool(TOOL), SUBCOLLECTIONS.updates)));
  });

  it('allows a visitor to list tools and bundles filtered to published', async () => {
    const db = rules.visitor();
    const tools = await assertSucceeds(
      getDocs(query(collection(db, COLLECTIONS.tools), publishedOnly())),
    );
    expect(tools.docs.map((snap) => snap.id).sort()).toEqual([OTHER_TOOL, TOOL]);
    const bundles = await assertSucceeds(
      getDocs(query(collection(db, COLLECTIONS.bundles), publishedOnly())),
    );
    expect(bundles.docs.map((snap) => snap.id)).toEqual([BUNDLE]);
  });

  it('allows a signed-in non-admin to get and list published tools', async () => {
    const db = rules.as(ALICE);
    await assertSucceeds(getDoc(doc(db, paths.tool(TOOL))));
    await assertSucceeds(getDocs(query(collection(db, COLLECTIONS.tools), publishedOnly())));
  });

  it('allows anyone to query updates as a collection group by toolId', async () => {
    for (const db of [rules.visitor(), rules.as(ALICE)]) {
      const snap = await assertSucceeds(
        getDocs(
          query(
            collectionGroup(db, SUBCOLLECTIONS.updates),
            where('toolId', 'in', [TOOL, OTHER_TOOL]),
          ),
        ),
      );
      expect(snap.size).toBe(2);
    }
  });

  it('allows an admin to get drafts and list tools and bundles unfiltered', async () => {
    const db = rules.as(ADMIN);
    await assertSucceeds(getDoc(doc(db, paths.tool(DRAFT_TOOL))));
    await assertSucceeds(getDoc(doc(db, paths.bundle(DRAFT_BUNDLE))));
    const tools = await assertSucceeds(getDocs(collection(db, COLLECTIONS.tools)));
    expect(tools.size).toBe(3);
    const bundles = await assertSucceeds(getDocs(collection(db, COLLECTIONS.bundles)));
    expect(bundles.size).toBe(2);
  });

  it('denies a visitor getting an unpublished tool', async () => {
    await assertFails(getDoc(doc(rules.visitor(), paths.tool(DRAFT_TOOL))));
  });

  it('denies a signed-in non-admin getting an unpublished tool', async () => {
    await assertFails(getDoc(doc(rules.as(ALICE), paths.tool(DRAFT_TOOL))));
  });

  it('denies a visitor getting an unpublished bundle', async () => {
    await assertFails(getDoc(doc(rules.visitor(), paths.bundle(DRAFT_BUNDLE))));
  });

  it('denies a signed-in non-admin getting an unpublished bundle', async () => {
    await assertFails(getDoc(doc(rules.as(ALICE), paths.bundle(DRAFT_BUNDLE))));
  });

  it('denies a visitor listing tools without the published filter', async () => {
    await assertFails(getDocs(collection(rules.visitor(), COLLECTIONS.tools)));
  });

  it('denies a visitor listing bundles without the published filter', async () => {
    await assertFails(getDocs(collection(rules.visitor(), COLLECTIONS.bundles)));
  });

  it('denies a signed-in non-admin listing tools without the published filter', async () => {
    await assertFails(getDocs(collection(rules.as(ALICE), COLLECTIONS.tools)));
  });

  it('denies a non-admin listing unpublished tools', async () => {
    await assertFails(
      getDocs(
        query(collection(rules.as(ALICE), COLLECTIONS.tools), where('published', '==', false)),
      ),
    );
  });
});
