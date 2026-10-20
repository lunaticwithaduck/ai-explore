import {
  type DocumentData,
  doc,
  type Firestore,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { newReview } from './builders';
import { paths } from './paths';

export const ratingDelta = (count: number, sum: number): DocumentData => ({
  'rating.count': increment(count),
  'rating.sum': increment(sum),
});

export const sumDelta = (sum: number): DocumentData => ({ 'rating.sum': increment(sum) });

export function createReview(
  db: Firestore,
  slug: string,
  uid: string,
  rating: number,
  review: DocumentData = newReview(slug, uid, rating),
  delta: DocumentData = ratingDelta(1, rating),
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(doc(db, paths.review(slug, uid)), review);
  batch.update(doc(db, paths.tool(slug)), delta);
  return batch.commit();
}

export function editReview(
  db: Firestore,
  slug: string,
  uid: string,
  from: number,
  to: number,
): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, paths.review(slug, uid)), {
    rating: to,
    body: `Changed my mind: ${to} stars.`,
    updatedAt: serverTimestamp(),
  });
  if (to !== from) batch.update(doc(db, paths.tool(slug)), sumDelta(to - from));
  return batch.commit();
}

export function deleteReview(
  db: Firestore,
  slug: string,
  uid: string,
  rating: number,
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, paths.review(slug, uid)));
  batch.update(doc(db, paths.tool(slug)), ratingDelta(-1, -rating));
  return batch.commit();
}

export function castVote(
  db: Firestore,
  slug: string,
  authorUid: string,
  voterUid: string,
  delta = 1,
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(doc(db, paths.vote(slug, authorUid, voterUid)), { createdAt: serverTimestamp() });
  batch.update(doc(db, paths.review(slug, authorUid)), { helpfulCount: increment(delta) });
  return batch.commit();
}

export function withdrawVote(
  db: Firestore,
  slug: string,
  authorUid: string,
  voterUid: string,
  delta = -1,
): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, paths.vote(slug, authorUid, voterUid)));
  batch.update(doc(db, paths.review(slug, authorUid)), { helpfulCount: increment(delta) });
  return batch.commit();
}

export async function concurrently(...commits: Promise<void>[]): Promise<void> {
  const results = await Promise.allSettled(commits);
  for (const result of results) if (result.status === 'rejected') throw result.reason;
}
