import { COLLECTIONS, type Locale, SUBCOLLECTIONS } from '@ai-explore/schemas';
import {
  type DocumentData,
  doc,
  type Firestore,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

export type ReviewAuthor = {
  uid: string;
  displayName: string;
  photoUrl: string | null;
};

export type NewReviewInput = {
  rating: number;
  body: string;
  locale: Locale;
};

export type ReviewEdit = {
  rating: number;
  body: string;
};

const toolRef = (db: Firestore, toolId: string) => doc(db, COLLECTIONS.tools, toolId);

const reviewRef = (db: Firestore, toolId: string, authorUid: string) =>
  doc(db, COLLECTIONS.tools, toolId, SUBCOLLECTIONS.reviews, authorUid);

const voteRef = (db: Firestore, toolId: string, authorUid: string, voterUid: string) =>
  doc(
    db,
    COLLECTIONS.tools,
    toolId,
    SUBCOLLECTIONS.reviews,
    authorUid,
    SUBCOLLECTIONS.votes,
    voterUid,
  );

const ratingChange = (count: number, sum: number): DocumentData => ({
  'rating.count': increment(count),
  'rating.sum': increment(sum),
});

export function createReview(
  db: Firestore,
  toolId: string,
  user: ReviewAuthor,
  { rating, body, locale }: NewReviewInput,
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(reviewRef(db, toolId, user.uid), {
    toolId,
    authorUid: user.uid,
    rating,
    body,
    authorName: user.displayName,
    authorPhotoUrl: user.photoUrl,
    locale,
    helpfulCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.update(toolRef(db, toolId), ratingChange(1, rating));
  return batch.commit();
}

export function updateReview(
  db: Firestore,
  toolId: string,
  uid: string,
  previousRating: number,
  { rating, body }: ReviewEdit,
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(reviewRef(db, toolId, uid), { rating, body, updatedAt: serverTimestamp() });
  if (rating !== previousRating)
    batch.update(toolRef(db, toolId), { 'rating.sum': increment(rating - previousRating) });
  return batch.commit();
}

export function deleteReview(
  db: Firestore,
  toolId: string,
  uid: string,
  rating: number,
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(reviewRef(db, toolId, uid));
  batch.update(toolRef(db, toolId), ratingChange(-1, -rating));
  return batch.commit();
}

export function voteHelpful(
  db: Firestore,
  toolId: string,
  authorUid: string,
  voterUid: string,
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(voteRef(db, toolId, authorUid, voterUid), { createdAt: serverTimestamp() });
  batch.update(reviewRef(db, toolId, authorUid), { helpfulCount: increment(1) });
  return batch.commit();
}

export function unvoteHelpful(
  db: Firestore,
  toolId: string,
  authorUid: string,
  voterUid: string,
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(voteRef(db, toolId, authorUid, voterUid));
  batch.update(reviewRef(db, toolId, authorUid), { helpfulCount: increment(-1) });
  return batch.commit();
}
