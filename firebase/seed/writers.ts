import { APP_CONFIG_DOC, COLLECTIONS, SUBCOLLECTIONS } from '@ai-explore/schemas';
import type { Firestore } from 'firebase-admin/firestore';
import { E2E_ACCOUNTS } from './accounts';
import type { SeedData } from './types';
import { E2E_MEMBER_CREATED_AT, memberProfile, updateId } from './validate';

export async function writeCatalogue(db: Firestore, seed: SeedData): Promise<number> {
  const writer = db.bulkWriter();
  let count = 0;
  const put = (path: string, data: object) => {
    count += 1;
    void writer.set(db.doc(path), data);
  };
  for (const [id, category] of Object.entries(seed.categories)) {
    put(`${COLLECTIONS.categories}/${id}`, category);
  }
  for (const [slug, tool] of Object.entries(seed.tools)) {
    put(`${COLLECTIONS.tools}/${slug}`, tool);
  }
  for (const [slug, list] of Object.entries(seed.updates)) {
    for (const update of list) {
      put(
        `${COLLECTIONS.tools}/${slug}/${SUBCOLLECTIONS.updates}/${updateId(update.version)}`,
        update,
      );
    }
  }
  for (const [slug, list] of Object.entries(seed.reviews)) {
    for (const review of list) {
      put(`${COLLECTIONS.tools}/${slug}/${SUBCOLLECTIONS.reviews}/${review.authorUid}`, review);
    }
  }
  for (const [slug, bundle] of Object.entries(seed.bundles)) {
    put(`${COLLECTIONS.bundles}/${slug}`, bundle);
  }
  put(`${COLLECTIONS.config}/${APP_CONFIG_DOC}`, seed.appConfig);
  await writer.close();
  return count;
}

export async function writeAccounts(db: Firestore): Promise<void> {
  const { admin, member } = E2E_ACCOUNTS;
  await db.doc(`${COLLECTIONS.admins}/${admin.uid}`).set({ createdAt: E2E_MEMBER_CREATED_AT });
  await db.doc(`${COLLECTIONS.users}/${member.uid}`).set(memberProfile());
  for (const toolId of member.savedToolIds) {
    await db
      .doc(`${COLLECTIONS.users}/${member.uid}/${SUBCOLLECTIONS.saved}/${toolId}`)
      .set({ savedAt: E2E_MEMBER_CREATED_AT });
  }
}
