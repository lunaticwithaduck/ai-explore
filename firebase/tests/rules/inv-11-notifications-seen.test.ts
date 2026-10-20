import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { newProfile, profileDoc } from './builders';
import { ALICE, BOB, useRules } from './fixtures';
import { paths } from './paths';

const SEEN_AT = new Date('2026-02-01T08:00:00Z');

describe.skip('INV-11: notificationsSeenAt is only ever written as request.time', () => {
  const rules = useRules();

  beforeEach(async () => {
    await rules.seed({
      [paths.user(ALICE)]: profileDoc(),
      [paths.user(BOB)]: profileDoc({ displayName: 'Bob', notificationsSeenAt: SEEN_AT }),
    });
  });

  const markSeen = (uid: string, value: unknown) =>
    updateDoc(doc(rules.as(uid), paths.user(uid)), { notificationsSeenAt: value });

  it('allows marking notifications seen with serverTimestamp()', async () => {
    await assertSucceeds(markSeen(ALICE, serverTimestamp()));
    const seen = (await rules.read(paths.user(ALICE)))?.notificationsSeenAt;
    expect(seen).toBeInstanceOf(Timestamp);
  });

  it('allows moving an existing notificationsSeenAt forward with serverTimestamp()', async () => {
    await assertSucceeds(markSeen(BOB, serverTimestamp()));
    const seen = (await rules.read(paths.user(BOB)))?.notificationsSeenAt as Timestamp;
    expect(seen.toMillis()).toBeGreaterThan(SEEN_AT.getTime());
  });

  it('allows other profile edits that leave notificationsSeenAt untouched', async () => {
    await assertSucceeds(updateDoc(doc(rules.as(BOB), paths.user(BOB)), { displayName: 'Bob B.' }));
  });

  it('denies a client Timestamp', async () => {
    await assertFails(markSeen(ALICE, Timestamp.now()));
    await assertFails(markSeen(BOB, Timestamp.fromMillis(Date.now() + 86_400_000)));
  });

  it('denies a client Date', async () => {
    await assertFails(markSeen(ALICE, new Date()));
  });

  it('denies resetting it to null or to a non-timestamp value', async () => {
    await assertFails(markSeen(BOB, null));
    await assertFails(markSeen(ALICE, 'now'));
  });

  it('denies a client timestamp on profile create', async () => {
    await assertFails(
      setDoc(doc(rules.as('newcomer'), paths.user('newcomer')), {
        ...newProfile(),
        notificationsSeenAt: Timestamp.now(),
      }),
    );
  });
});
