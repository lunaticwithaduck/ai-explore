import {
  type Bundle,
  type BundlePeriod,
  bundleInterestSchema,
  bundleSchema,
  type Category,
  COLLECTIONS,
  categorySchema,
  SUBCOLLECTIONS,
  type Tool,
  type ToolUpdate,
  toolSchema,
  toolUpdateSchema,
  type WithId,
} from '@ai-explore/schemas';
import {
  collection,
  collectionGroup,
  type DocumentData,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import {
  connectFirestoreEmulator as connectLiteEmulator,
  getFirestore as getLiteFirestore,
  type Firestore as LiteFirestore,
  doc as liteDoc,
  setDoc as liteSetDoc,
  updateDoc as liteUpdateDoc,
  serverTimestamp,
} from 'firebase/firestore/lite';
import { useEmulators } from '@/config/env';
import { clientDb } from '@/lib/firebase/client';
import { emulatorHost, firestoreEmulatorPort } from '@/lib/firebase/config';
import { parseDoc, parseDocs } from '@/lib/firebase/parse';
import { firestoreApi } from '../firestoreApi';
import { firestoreCall } from '../firestoreCall';

export type AdminInterestEntry = {
  bundleId: string;
  period: BundlePeriod;
};

export type SaveToolArgs = {
  slug: string;
  mode: 'create' | 'update';
  data: DocumentData;
};

export type SaveBundleArgs = SaveToolArgs;

export type AdminUpdateEntry = {
  toolId: string;
  updateId: string;
  update: ToolUpdate;
};

export type CreateUpdateArgs = {
  mode?: SaveToolArgs['mode'];
  toolId: string;
  updateId: string;
  data: DocumentData;
};

export const adminTimestamp = serverTimestamp;

let liteDb: LiteFirestore | undefined;

const writer = (): LiteFirestore => {
  if (!liteDb) {
    liteDb = getLiteFirestore(clientDb().app);
    if (useEmulators) connectLiteEmulator(liteDb, emulatorHost, firestoreEmulatorPort);
  }
  return liteDb;
};

const writeDocument = async (path: string[], mode: SaveToolArgs['mode'], data: DocumentData) => {
  const [first, ...rest] = path;
  const ref = liteDoc(writer(), first ?? '', ...rest);
  if (mode === 'create') await liteSetDoc(ref, data);
  else await liteUpdateDoc(ref, data);
};

const adminApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    adminTools: build.query<WithId<Tool>[], void>({
      queryFn: () =>
        firestoreCall(async () => {
          const snap = await getDocs(collection(clientDb(), COLLECTIONS.tools));
          return parseDocs(toolSchema, snap.docs).sort((a, b) => a.name.localeCompare(b.name));
        }),
      providesTags: ['AdminTool'],
    }),
    adminTool: build.query<WithId<Tool> | null, string>({
      queryFn: (slug) =>
        firestoreCall(async () => {
          const snap = await getDoc(doc(clientDb(), COLLECTIONS.tools, slug));
          return snap.exists() ? parseDoc(toolSchema, snap.id, snap.data()) : null;
        }),
      providesTags: (_result, _error, slug) => [{ type: 'AdminTool', id: slug }],
    }),
    adminCategories: build.query<WithId<Category>[], void>({
      queryFn: () =>
        firestoreCall(async () => {
          const snap = await getDocs(collection(clientDb(), COLLECTIONS.categories));
          return parseDocs(categorySchema, snap.docs).sort((a, b) => a.order - b.order);
        }),
    }),
    saveTool: build.mutation<null, SaveToolArgs>({
      queryFn: ({ slug, mode, data }) =>
        firestoreCall(async () => {
          await writeDocument([COLLECTIONS.tools, slug], mode, data);
          return null;
        }),
      invalidatesTags: ['AdminTool'],
    }),
    adminBundles: build.query<WithId<Bundle>[], void>({
      queryFn: () =>
        firestoreCall(async () => {
          const snap = await getDocs(collection(clientDb(), COLLECTIONS.bundles));
          return parseDocs(bundleSchema, snap.docs).sort((a, b) => a.id.localeCompare(b.id));
        }),
      providesTags: ['AdminBundle'],
    }),
    saveBundle: build.mutation<null, SaveBundleArgs>({
      queryFn: ({ slug, mode, data }) =>
        firestoreCall(async () => {
          await writeDocument([COLLECTIONS.bundles, slug], mode, data);
          return null;
        }),
      invalidatesTags: ['AdminBundle'],
    }),
    createUpdate: build.mutation<null, CreateUpdateArgs>({
      queryFn: ({ mode = 'create', toolId, updateId, data }) =>
        firestoreCall(async () => {
          await writeDocument(
            [COLLECTIONS.tools, toolId, SUBCOLLECTIONS.updates, updateId],
            mode,
            data,
          );
          return null;
        }),
      invalidatesTags: ['AdminUpdate'],
    }),
    adminUpdates: build.query<AdminUpdateEntry[], void>({
      queryFn: () =>
        firestoreCall(async () => {
          const snap = await getDocs(collectionGroup(clientDb(), SUBCOLLECTIONS.updates));
          const entries = snap.docs.flatMap((entry) => {
            const toolId = entry.ref.parent.parent?.id;
            const update = parseDoc(toolUpdateSchema, entry.id, entry.data());
            return toolId && update ? [{ toolId, updateId: entry.id, update }] : [];
          });
          return entries.sort(
            (a, b) => b.update.publishedAt.getTime() - a.update.publishedAt.getTime(),
          );
        }),
      providesTags: ['AdminUpdate'],
    }),
    adminUpdate: build.query<ToolUpdate | null, Pick<CreateUpdateArgs, 'toolId' | 'updateId'>>({
      queryFn: ({ toolId, updateId }) =>
        firestoreCall(async () => {
          const snap = await getDoc(
            doc(clientDb(), COLLECTIONS.tools, toolId, SUBCOLLECTIONS.updates, updateId),
          );
          return snap.exists() ? parseDoc(toolUpdateSchema, snap.id, snap.data()) : null;
        }),
      providesTags: (_result, _error, { toolId, updateId }) => [
        { type: 'AdminUpdate', id: `${toolId}/${updateId}` },
      ],
    }),
    adminInterest: build.query<AdminInterestEntry[], void>({
      queryFn: () =>
        firestoreCall(async () => {
          const snap = await getDocs(collectionGroup(clientDb(), SUBCOLLECTIONS.bundleInterest));
          return snap.docs.flatMap((entry) => {
            const parsed = parseDoc(bundleInterestSchema, entry.id, entry.data());
            return parsed ? [{ bundleId: entry.id, period: parsed.period }] : [];
          });
        }),
      providesTags: ['AdminInterest'],
    }),
  }),
});

export const {
  useAdminToolsQuery,
  useAdminToolQuery,
  useAdminCategoriesQuery,
  useSaveToolMutation,
  useAdminBundlesQuery,
  useSaveBundleMutation,
  useCreateUpdateMutation,
  useAdminUpdatesQuery,
  useAdminUpdateQuery,
  useAdminInterestQuery,
} = adminApi;
