import {
  type BundleInterest,
  type BundlePeriod,
  bundleInterestSchema,
  COLLECTIONS,
  SUBCOLLECTIONS,
} from '@ai-explore/schemas';
import {
  type DocumentSnapshot,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';
import { parseDoc } from '@/lib/firebase/parse';
import { firestoreApi } from '../firestoreApi';
import { firestoreCall } from '../firestoreCall';

export type BundleInterestArgs = {
  uid: string;
  bundleId: string;
};

export type RegisterInterestArgs = BundleInterestArgs & {
  period: BundlePeriod;
};

const interestRef = ({ uid, bundleId }: BundleInterestArgs) =>
  doc(clientDb(), COLLECTIONS.users, uid, SUBCOLLECTIONS.bundleInterest, bundleId);

const readInterest = (snap: DocumentSnapshot): BundleInterest | null => {
  if (!snap.exists()) return null;
  const parsed = parseDoc(
    bundleInterestSchema,
    snap.id,
    snap.data({ serverTimestamps: 'estimate' }),
  );
  return parsed ? { period: parsed.period, createdAt: parsed.createdAt } : null;
};

const bundleInterestApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    bundleInterest: build.query<BundleInterest | null, BundleInterestArgs>({
      queryFn: (args) => firestoreCall(async () => readInterest(await getDoc(interestRef(args)))),
      keepUnusedDataFor: 0,
      providesTags: (_result, _error, { uid, bundleId }) => [
        { type: 'BundleInterest', id: `${uid}:${bundleId}` },
      ],
      async onCacheEntryAdded(args, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded;
        } catch {
          return;
        }
        const unsubscribe = onSnapshot(
          interestRef(args),
          (snap) => updateCachedData(() => readInterest(snap)),
          (error) => console.warn(`Bundle interest listener stopped`, error.code),
        );
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    registerInterest: build.mutation<null, RegisterInterestArgs>({
      queryFn: ({ period, ...args }) =>
        firestoreCall(async () => {
          const ref = interestRef(args);
          if ((await getDoc(ref)).exists()) return null;
          await setDoc(ref, { period, createdAt: serverTimestamp() });
          return null;
        }),
    }),
  }),
});

export const { useBundleInterestQuery, useRegisterInterestMutation } = bundleInterestApi;
