import { COLLECTIONS, reviewSchema, SUBCOLLECTIONS } from '@ai-explore/schemas';
import { deleteUser, type User } from 'firebase/auth';
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  type Firestore,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { authErrorCode } from '@/features/auth/utils/authErrors';
import { deleteReview } from '@/features/reviews/utils/reviewBatch';
import { parseDocs } from '@/lib/firebase/parse';
import {
  DELETE_BATCH_SIZE,
  type DeleteStep,
  OWNED_SUBCOLLECTIONS,
  type OwnedSubcollection,
} from '../config/constants';

export type DeleteAccountOptions = {
  db: Firestore;
  user: User;
  reauthenticate: () => Promise<void>;
  onStep: (step: DeleteStep) => void;
};

const ownReviewSchema = reviewSchema.pick({ toolId: true, rating: true });

export const isRecentLoginRequired = (error: unknown) =>
  authErrorCode(error) === 'auth/requires-recent-login';

async function deleteOwnReviews(db: Firestore, uid: string) {
  const snap = await getDocs(
    query(collectionGroup(db, SUBCOLLECTIONS.reviews), where('authorUid', '==', uid)),
  );
  for (const review of parseDocs(ownReviewSchema, snap.docs))
    await deleteReview(db, review.toolId, uid, review.rating);
}

async function deleteOwnSubcollection(db: Firestore, uid: string, name: OwnedSubcollection) {
  const { docs } = await getDocs(collection(db, COLLECTIONS.users, uid, name));
  for (let start = 0; start < docs.length; start += DELETE_BATCH_SIZE) {
    const batch = writeBatch(db);
    for (const entry of docs.slice(start, start + DELETE_BATCH_SIZE)) batch.delete(entry.ref);
    await batch.commit();
  }
}

async function deleteAuthUser(user: User, reauthenticate: () => Promise<void>) {
  try {
    await deleteUser(user);
  } catch (error) {
    if (!isRecentLoginRequired(error)) throw error;
    await reauthenticate();
    await deleteUser(user);
  }
}

export async function deleteAccount({
  db,
  user,
  reauthenticate,
  onStep,
}: DeleteAccountOptions): Promise<void> {
  onStep('reviews');
  await deleteOwnReviews(db, user.uid);
  onStep('library');
  for (const name of OWNED_SUBCOLLECTIONS) await deleteOwnSubcollection(db, user.uid, name);
  onStep('profile');
  await deleteDoc(doc(db, COLLECTIONS.users, user.uid));
  onStep('account');
  await deleteAuthUser(user, reauthenticate);
}
