import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { deleteDoc, doc, type Firestore, setDoc, updateDoc } from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { bundleDoc, categoryDoc, toolDoc, toolUpdateDoc } from './builders';
import { ADMIN, ALICE, useRules } from './fixtures';
import { paths } from './paths';

const TOOL = 'midjourney';
const NEW_TOOL = 'new-tool';
const BUNDLE = 'startup-founder-pack';

describe('INV-2: only admins write the catalogue', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.admin(ADMIN)]: {},
      [paths.category('image')]: categoryDoc(),
      [paths.tool(TOOL)]: toolDoc(TOOL),
      [paths.update(TOOL, 'v7')]: toolUpdateDoc(TOOL),
      [paths.bundle(BUNDLE)]: bundleDoc(BUNDLE),
      [paths.appConfig]: { checkoutEnabled: false },
    });
  });

  const nonAdmins = (): Firestore[] => [rules.as(ALICE), rules.visitor()];

  it('allows an admin to create, edit and delete a tool', async () => {
    const db = rules.as(ADMIN);
    await assertSucceeds(setDoc(doc(db, paths.tool(NEW_TOOL)), toolDoc(NEW_TOOL)));
    await assertSucceeds(updateDoc(doc(db, paths.tool(NEW_TOOL)), { published: false }));
    await assertSucceeds(deleteDoc(doc(db, paths.tool(NEW_TOOL))));
    expect(await rules.read(paths.tool(NEW_TOOL))).toBeUndefined();
  });

  it('allows an admin to create, edit and delete a category', async () => {
    const db = rules.as(ADMIN);
    await assertSucceeds(setDoc(doc(db, paths.category('audio')), categoryDoc(3)));
    await assertSucceeds(updateDoc(doc(db, paths.category('audio')), { order: 4 }));
    await assertSucceeds(deleteDoc(doc(db, paths.category('audio'))));
  });

  it('allows an admin to publish a tool update and edit a bundle', async () => {
    const db = rules.as(ADMIN);
    await assertSucceeds(setDoc(doc(db, paths.update(TOOL, 'v8')), toolUpdateDoc(TOOL)));
    await assertSucceeds(updateDoc(doc(db, paths.bundle(BUNDLE)), { published: false }));
    await assertSucceeds(deleteDoc(doc(db, paths.update(TOOL, 'v7'))));
  });

  it('allows an admin to create a bundle and write config/app', async () => {
    const db = rules.as(ADMIN);
    await assertSucceeds(setDoc(doc(db, paths.bundle('new-bundle')), bundleDoc('new-bundle')));
    await assertSucceeds(setDoc(doc(db, paths.appConfig), { checkoutEnabled: false }));
  });

  it('denies non-admins creating a tool', async () => {
    for (const db of nonAdmins())
      await assertFails(setDoc(doc(db, paths.tool(NEW_TOOL)), toolDoc(NEW_TOOL)));
  });

  it('denies non-admins editing a tool', async () => {
    for (const db of nonAdmins())
      await assertFails(updateDoc(doc(db, paths.tool(TOOL)), { name: 'Hijacked' }));
  });

  it('denies non-admins deleting a tool', async () => {
    for (const db of nonAdmins()) await assertFails(deleteDoc(doc(db, paths.tool(TOOL))));
  });

  it('denies non-admins creating, editing or deleting a category', async () => {
    for (const db of nonAdmins()) {
      await assertFails(setDoc(doc(db, paths.category('audio')), categoryDoc(3)));
      await assertFails(updateDoc(doc(db, paths.category('image')), { order: 9 }));
      await assertFails(deleteDoc(doc(db, paths.category('image'))));
    }
  });

  it('denies non-admins creating, editing or deleting a tool update', async () => {
    for (const db of nonAdmins()) {
      await assertFails(setDoc(doc(db, paths.update(TOOL, 'v8')), toolUpdateDoc(TOOL)));
      await assertFails(updateDoc(doc(db, paths.update(TOOL, 'v7')), { version: '9.9' }));
      await assertFails(deleteDoc(doc(db, paths.update(TOOL, 'v7'))));
    }
  });

  it('denies non-admins creating, editing or deleting a bundle', async () => {
    for (const db of nonAdmins()) {
      await assertFails(setDoc(doc(db, paths.bundle('new-bundle')), bundleDoc('new-bundle')));
      await assertFails(updateDoc(doc(db, paths.bundle(BUNDLE)), { published: false }));
      await assertFails(deleteDoc(doc(db, paths.bundle(BUNDLE))));
    }
  });

  it('denies non-admins writing config/app', async () => {
    for (const db of nonAdmins()) {
      await assertFails(setDoc(doc(db, paths.appConfig), { checkoutEnabled: true }));
      await assertFails(updateDoc(doc(db, paths.appConfig), { checkoutEnabled: true }));
    }
  });
});
