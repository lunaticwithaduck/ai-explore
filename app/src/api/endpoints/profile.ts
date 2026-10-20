import {
  COLLECTIONS,
  type Locale,
  type UserProfile,
  userProfileSchema,
  type WithId,
} from '@ai-explore/schemas';
import {
  type DocumentSnapshot,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';
import { parseDoc } from '@/lib/firebase/parse';
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

export const { useProfileQuery, useEnsureProfileMutation, useUpdateProfileMutation } = profileApi;
