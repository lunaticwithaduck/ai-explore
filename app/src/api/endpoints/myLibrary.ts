import {
  type Accent,
  COLLECTIONS,
  SUBCOLLECTIONS,
  type UserCollection,
  userCollectionSchema,
  type WithId,
} from '@ai-explore/schemas';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  type QuerySnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';
import { parseDocs } from '@/lib/firebase/parse';
import { firestoreApi } from '../firestoreApi';
import { firestoreCall } from '../firestoreCall';

export type CollectionDoc = WithId<UserCollection>;

export type SaveToolArgs = { uid: string; toolId: string };

export type CreateCollectionArgs = {
  uid: string;
  name: string;
  icon: UserCollection['icon'];
  color: Accent;
  toolIds: string[];
  order: number;
};

export type CollectionRefArgs = { uid: string; collectionId: string };
export type RenameCollectionArgs = CollectionRefArgs & { name: string };
export type CollectionToolArgs = CollectionRefArgs & { toolId: string };

const savedCol = (uid: string) =>
  collection(clientDb(), COLLECTIONS.users, uid, SUBCOLLECTIONS.saved);
const collectionsCol = (uid: string) =>
  collection(clientDb(), COLLECTIONS.users, uid, SUBCOLLECTIONS.collections);
const collectionRef = (uid: string, collectionId: string) =>
  doc(clientDb(), COLLECTIONS.users, uid, SUBCOLLECTIONS.collections, collectionId);

const collectionsQuery = (uid: string) => query(collectionsCol(uid), orderBy('order'));

const readSaved = (snap: QuerySnapshot): string[] => snap.docs.map((d) => d.id);
const readCollections = (snap: QuerySnapshot): CollectionDoc[] =>
  parseDocs(
    userCollectionSchema,
    snap.docs.map((d) => ({ id: d.id, data: () => d.data({ serverTimestamps: 'estimate' }) })),
  );

const myLibraryApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    savedIds: build.query<string[], string>({
      queryFn: (uid) => firestoreCall(async () => readSaved(await getDocs(savedCol(uid)))),
      keepUnusedDataFor: 0,
      providesTags: (_result, _error, uid) => [{ type: 'Saved', id: uid }],
      async onCacheEntryAdded(uid, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded;
        } catch {
          return;
        }
        const unsubscribe = onSnapshot(
          savedCol(uid),
          (snap) => updateCachedData(() => readSaved(snap)),
          (error) => console.warn(`Saved listener for ${uid} stopped`, error.code),
        );
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    collections: build.query<CollectionDoc[], string>({
      queryFn: (uid) =>
        firestoreCall(async () => readCollections(await getDocs(collectionsQuery(uid)))),
      keepUnusedDataFor: 0,
      providesTags: (_result, _error, uid) => [{ type: 'Collection', id: uid }],
      async onCacheEntryAdded(uid, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded;
        } catch {
          return;
        }
        const unsubscribe = onSnapshot(
          collectionsQuery(uid),
          (snap) => updateCachedData(() => readCollections(snap)),
          (error) => console.warn(`Collections listener for ${uid} stopped`, error.code),
        );
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    saveToLibrary: build.mutation<null, SaveToolArgs>({
      queryFn: ({ uid, toolId }) =>
        firestoreCall(async () => {
          await setDoc(doc(savedCol(uid), toolId), { savedAt: serverTimestamp() });
          return null;
        }),
      async onQueryStarted({ uid, toolId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          myLibraryApi.util.updateQueryData('savedIds', uid, (ids) => {
            if (!ids.includes(toolId)) ids.push(toolId);
          }),
        );
        queryFulfilled.catch(patch.undo);
      },
    }),
    unsaveFromLibrary: build.mutation<null, SaveToolArgs>({
      queryFn: ({ uid, toolId }) =>
        firestoreCall(async () => {
          await deleteDoc(doc(savedCol(uid), toolId));
          return null;
        }),
      async onQueryStarted({ uid, toolId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          myLibraryApi.util.updateQueryData('savedIds', uid, (ids) => {
            const index = ids.indexOf(toolId);
            if (index >= 0) ids.splice(index, 1);
          }),
        );
        queryFulfilled.catch(patch.undo);
      },
    }),
    createCollection: build.mutation<string, CreateCollectionArgs>({
      queryFn: ({ uid, name, icon, color, toolIds, order }) =>
        firestoreCall(async () => {
          const ref = await addDoc(collectionsCol(uid), {
            name,
            icon,
            color,
            toolIds,
            order,
            createdAt: serverTimestamp(),
          });
          return ref.id;
        }),
    }),
    renameCollection: build.mutation<null, RenameCollectionArgs>({
      queryFn: ({ uid, collectionId, name }) =>
        firestoreCall(async () => {
          await updateDoc(collectionRef(uid, collectionId), { name });
          return null;
        }),
    }),
    deleteCollection: build.mutation<null, CollectionRefArgs>({
      queryFn: ({ uid, collectionId }) =>
        firestoreCall(async () => {
          await deleteDoc(collectionRef(uid, collectionId));
          return null;
        }),
    }),
    addToCollection: build.mutation<null, CollectionToolArgs>({
      queryFn: ({ uid, collectionId, toolId }) =>
        firestoreCall(async () => {
          await updateDoc(collectionRef(uid, collectionId), { toolIds: arrayUnion(toolId) });
          return null;
        }),
    }),
    removeFromCollection: build.mutation<null, CollectionToolArgs>({
      queryFn: ({ uid, collectionId, toolId }) =>
        firestoreCall(async () => {
          await updateDoc(collectionRef(uid, collectionId), { toolIds: arrayRemove(toolId) });
          return null;
        }),
    }),
  }),
});

export const {
  useSavedIdsQuery,
  useCollectionsQuery,
  useSaveToLibraryMutation,
  useUnsaveFromLibraryMutation,
  useCreateCollectionMutation,
  useRenameCollectionMutation,
  useDeleteCollectionMutation,
  useAddToCollectionMutation,
  useRemoveFromCollectionMutation,
} = myLibraryApi;
