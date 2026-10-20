import {
  COLLECTIONS,
  type Locale,
  type Review,
  reviewSchema,
  SUBCOLLECTIONS,
  type UserCollection,
  type UserProfile,
  userCollectionSchema,
  userProfileSchema,
  type WithId,
} from '@ai-explore/schemas';
import {
  collection,
  collectionGroup,
  type DocumentSnapshot,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';
import { parseDoc, parseDocs } from '@/lib/firebase/parse';
import { firestoreApi } from '../firestoreApi';
import { firestoreCall } from '../firestoreCall';

export type ProfileDoc = WithId<UserProfile>;

export type ProfilePatch = Partial<
  Pick<UserProfile, 'displayName' | 'photoUrl' | 'locale' | 'prefs'>
>;

export type NewProfileInput = {
  displayName: string;
  photoUrl: string | null;
  locale: Locale;
};

export type EnsureProfileArgs = NewProfileInput & {
  uid: string;
  overwriteDisplayName?: boolean;
};

export type UpdateProfileArgs = {
  uid: string;
  patch: ProfilePatch;
};

export type ProfileSummary = {
  savedCount: number;
  reviewCount: number;
  collections: WithId<UserCollection>[];
  recentReviews: WithId<Review>[];
};

export type ProfileSummaryArgs = { uid: string; recentLimit: number };

export const DEFAULT_PROFILE_PREFS = { productUpdates: true, emailDigest: false } as const;

export const newProfileFields = ({ displayName, photoUrl, locale }: NewProfileInput) => ({
  displayName,
  photoUrl,
  locale,
  prefs: { ...DEFAULT_PROFILE_PREFS },
  notificationsSeenAt: null,
  createdAt: serverTimestamp(),
});

const profileRef = (uid: string) => doc(clientDb(), COLLECTIONS.users, uid);

const readProfile = (snap: DocumentSnapshot): ProfileDoc | null =>
  snap.exists()
    ? parseDoc(userProfileSchema, snap.id, snap.data({ serverTimestamps: 'estimate' }))
    : null;

const profileApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    profile: build.query<ProfileDoc | null, string>({
      queryFn: (uid) => firestoreCall(async () => readProfile(await getDoc(profileRef(uid)))),
      keepUnusedDataFor: 0,
      providesTags: (_result, _error, uid) => [{ type: 'Profile', id: uid }],
      async onCacheEntryAdded(uid, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded;
        } catch {
          return;
        }
        const unsubscribe = onSnapshot(
          profileRef(uid),
          (snap) => updateCachedData(() => readProfile(snap)),
          (error) => console.warn(`Profile listener for ${uid} stopped`, error.code),
        );
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    ensureProfile: build.mutation<null, EnsureProfileArgs>({
      queryFn: ({ uid, overwriteDisplayName = false, ...input }) =>
        firestoreCall(() =>
          runTransaction(clientDb(), async (transaction) => {
            const ref = profileRef(uid);
            const snap = await transaction.get(ref);
            if (!snap.exists()) transaction.set(ref, newProfileFields(input));
            else if (overwriteDisplayName && snap.get('displayName') !== input.displayName)
              transaction.update(ref, { displayName: input.displayName });
            return null;
          }),
        ),
      invalidatesTags: (_result, _error, { uid }) => [{ type: 'Profile', id: uid }],
    }),
    profileSummary: build.query<ProfileSummary, ProfileSummaryArgs>({
      queryFn: ({ uid, recentLimit }) =>
        firestoreCall(async () => {
          const userRef = profileRef(uid);
          const authored = query(
            collectionGroup(clientDb(), SUBCOLLECTIONS.reviews),
            where('authorUid', '==', uid),
          );
          const [saved, reviews, collections, recent] = await Promise.all([
            getCountFromServer(collection(userRef, SUBCOLLECTIONS.saved)),
            getCountFromServer(authored),
            getDocs(query(collection(userRef, SUBCOLLECTIONS.collections), orderBy('order'))),
            getDocs(query(authored, orderBy('updatedAt', 'desc'), limit(recentLimit))),
          ]);
          return {
            savedCount: saved.data().count,
            reviewCount: reviews.data().count,
            collections: parseDocs(userCollectionSchema, collections.docs),
            recentReviews: parseDocs(reviewSchema, recent.docs),
          };
        }),
      keepUnusedDataFor: 0,
      providesTags: ['Saved', 'Collection', 'Review'],
    }),
    updateProfile: build.mutation<null, UpdateProfileArgs>({
      queryFn: ({ uid, patch }) =>
        firestoreCall(async () => {
          await updateDoc(profileRef(uid), patch);
          return null;
        }),
      invalidatesTags: (_result, _error, { uid }) => [{ type: 'Profile', id: uid }],
    }),
  }),
});

export const {
  useProfileQuery,
  useProfileSummaryQuery,
  useEnsureProfileMutation,
  useUpdateProfileMutation,
} = profileApi;
