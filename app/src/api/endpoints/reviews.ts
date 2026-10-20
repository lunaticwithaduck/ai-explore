import {
  COLLECTIONS,
  type RatingAggregate,
  type Review,
  reviewSchema,
  SUBCOLLECTIONS,
  toolSchema,
  type WithId,
} from '@ai-explore/schemas';
import {
  collection,
  type DocumentSnapshot,
  doc,
  type FirestoreError,
  getDoc,
  getDocs,
  onSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';
import { parseDoc, parseDocs } from '@/lib/firebase/parse';
import { firestoreApi } from '../firestoreApi';
import { firestoreCall } from '../firestoreCall';

export type ReviewDoc = WithId<Review>;

export type HelpfulVoteArgs = {
  toolId: string;
  authorUid: string;
  voterUid: string;
};

type StreamLifecycle = {
  cacheDataLoaded: Promise<unknown>;
  cacheEntryRemoved: Promise<unknown>;
};

const ratingSchema = toolSchema.pick({ rating: true });

const toolRef = (toolId: string) => doc(clientDb(), COLLECTIONS.tools, toolId);

const reviewsRef = (toolId: string) =>
  collection(clientDb(), COLLECTIONS.tools, toolId, SUBCOLLECTIONS.reviews);

const voteRef = ({ toolId, authorUid, voterUid }: HelpfulVoteArgs) =>
  doc(
    clientDb(),
    COLLECTIONS.tools,
    toolId,
    SUBCOLLECTIONS.reviews,
    authorUid,
    SUBCOLLECTIONS.votes,
    voterUid,
  );

const readRating = (snap: DocumentSnapshot): RatingAggregate | null =>
  snap.exists() ? (parseDoc(ratingSchema, snap.id, snap.data())?.rating ?? null) : null;

const readReviews = (snap: QuerySnapshot): ReviewDoc[] =>
  parseDocs(
    reviewSchema,
    snap.docs.map((review) => ({
      id: review.id,
      data: () => review.data({ serverTimestamps: 'estimate' }),
    })),
  );

const stopped = (what: string) => (error: FirestoreError) =>
  console.warn(`${what} listener stopped`, error.code);

async function stream(
  { cacheDataLoaded, cacheEntryRemoved }: StreamLifecycle,
  start: () => Unsubscribe,
) {
  try {
    await cacheDataLoaded;
  } catch {
    return;
  }
  const unsubscribe = start();
  await cacheEntryRemoved;
  unsubscribe();
}

const reviewsApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    toolRating: build.query<RatingAggregate | null, string>({
      queryFn: (toolId) => firestoreCall(async () => readRating(await getDoc(toolRef(toolId)))),
      onCacheEntryAdded: (toolId, lifecycle) =>
        stream(lifecycle, () =>
          onSnapshot(
            toolRef(toolId),
            (snap) => lifecycle.updateCachedData(() => readRating(snap)),
            stopped(`Rating ${toolId}`),
          ),
        ),
    }),
    toolReviews: build.query<ReviewDoc[], string>({
      queryFn: (toolId) =>
        firestoreCall(async () => readReviews(await getDocs(reviewsRef(toolId)))),
      providesTags: (_result, _error, toolId) => [{ type: 'Review', id: toolId }],
      onCacheEntryAdded: (toolId, lifecycle) =>
        stream(lifecycle, () =>
          onSnapshot(
            reviewsRef(toolId),
            (snap) => lifecycle.updateCachedData(() => readReviews(snap)),
            stopped(`Reviews ${toolId}`),
          ),
        ),
    }),
    helpfulVote: build.query<boolean, HelpfulVoteArgs>({
      queryFn: (args) => firestoreCall(async () => (await getDoc(voteRef(args))).exists()),
      providesTags: (_result, _error, { authorUid, voterUid }) => [
        { type: 'Vote', id: `${authorUid}/${voterUid}` },
      ],
      onCacheEntryAdded: (args, lifecycle) =>
        stream(lifecycle, () =>
          onSnapshot(
            voteRef(args),
            (snap) => lifecycle.updateCachedData(() => snap.exists()),
            stopped(`Vote ${args.authorUid}`),
          ),
        ),
    }),
  }),
});

export const { useToolRatingQuery, useToolReviewsQuery, useHelpfulVoteQuery } = reviewsApi;
