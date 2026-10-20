import { DISPLAY_NAME_MAX } from '@ai-explore/schemas';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  type DocumentData,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { newProfile, profileDoc, without } from './builders';
import { ALICE, useRules } from './fixtures';
import { paths } from './paths';

const NEWCOMER = 'newcomer';
const TOOL = 'midjourney';

describe('INV-10: profile and saved-tool documents reject unknown fields and bad values', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({ [paths.user(ALICE)]: profileDoc() });
  });

  const createProfile = (data: DocumentData) =>
    setDoc(doc(rules.as(NEWCOMER), paths.user(NEWCOMER)), data);
  const profile = (changes: DocumentData = {}) => ({ ...newProfile(), ...changes });
  const updateProfile = (changes: DocumentData) =>
    updateDoc(doc(rules.as(ALICE), paths.user(ALICE)), changes);
  const save = (data: DocumentData) => setDoc(doc(rules.as(ALICE), paths.saved(ALICE, TOOL)), data);

  it('allows a valid profile create at the length and locale limits', async () => {
    await assertSucceeds(
      createProfile(
        profile({
          displayName: 'n'.repeat(DISPLAY_NAME_MAX),
          photoUrl: 'https://example.com/me.png',
          locale: 'bg',
        }),
      ),
    );
    expect((await rules.read(paths.user(NEWCOMER)))?.notificationsSeenAt).toBeNull();
  });

  it('allows updating displayName, photoUrl, locale and prefs', async () => {
    await assertSucceeds(
      updateProfile({
        displayName: 'Alice A.',
        photoUrl: 'https://example.com/a.png',
        locale: 'bg',
        prefs: { productUpdates: false, emailDigest: true },
      }),
    );
    await assertSucceeds(updateProfile({ photoUrl: null }));
  });

  it('allows saving a tool with savedAt = request.time', async () => {
    await assertSucceeds(save({ savedAt: serverTimestamp() }));
  });

  it('denies a profile create with an unknown or missing field', async () => {
    await assertFails(createProfile(profile({ role: 'admin' })));
    await assertFails(createProfile(without(profile(), 'prefs')));
    await assertFails(createProfile(without(profile(), 'notificationsSeenAt')));
  });

  it('denies a displayName outside 1 to 60 characters', async () => {
    await assertFails(createProfile(profile({ displayName: '' })));
    await assertFails(createProfile(profile({ displayName: 'n'.repeat(DISPLAY_NAME_MAX + 1) })));
    await assertFails(updateProfile({ displayName: '' }));
    await assertFails(updateProfile({ displayName: 'n'.repeat(DISPLAY_NAME_MAX + 1) }));
  });

  it('denies a locale other than en or bg', async () => {
    await assertFails(createProfile(profile({ locale: 'de' })));
    await assertFails(updateProfile({ locale: 'fr' }));
  });

  it('denies prefs that are not exactly two booleans', async () => {
    await assertFails(createProfile(profile({ prefs: { productUpdates: true } })));
    await assertFails(
      createProfile(profile({ prefs: { productUpdates: true, emailDigest: false, sms: true } })),
    );
    await assertFails(updateProfile({ prefs: { productUpdates: 'yes', emailDigest: false } }));
  });

  it('denies a photoUrl that is neither a string nor null', async () => {
    await assertFails(createProfile(profile({ photoUrl: 42 })));
  });

  it('denies a client createdAt or a non-null notificationsSeenAt on create', async () => {
    await assertFails(createProfile(profile({ createdAt: Timestamp.now() })));
    await assertFails(createProfile(profile({ notificationsSeenAt: serverTimestamp() })));
  });

  it('denies a profile update that adds a field or changes createdAt', async () => {
    await assertFails(updateProfile({ role: 'admin' }));
    await assertFails(updateProfile({ createdAt: serverTimestamp() }));
  });

  it('denies a saved doc with unknown fields, a client time or no savedAt', async () => {
    await assertFails(save({ savedAt: serverTimestamp(), note: 'later' }));
    await assertFails(save({ savedAt: Timestamp.now() }));
    await assertFails(save({}));
  });
});
