import {
  COLLECTIONS,
  FIRESTORE_IN_LIMIT,
  NOTIFICATION_WINDOW_DAYS,
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
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';
import { parseDoc, parseDocs } from '@/lib/firebase/parse';
import { firestoreApi } from '../firestoreApi';
import { firestoreCall } from '../firestoreCall';

export type NotificationTool = Pick<Tool, 'name' | 'logo'> & { id: string };

export type NotificationItemData = {
  update: WithId<ToolUpdate>;
  tool: NotificationTool;
};

export function chunk<T>(items: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function mergeUpdates(chunks: readonly (readonly WithId<ToolUpdate>[])[]) {
  return chunks
    .flat()
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime() || a.id.localeCompare(b.id));
}

export function isNewUpdate(publishedAt: Date, seenAt: Date | null): boolean {
  return seenAt === null || publishedAt.getTime() > seenAt.getTime();
}

export function countNew(items: readonly { update: { publishedAt: Date } }[], seenAt: Date | null) {
  return items.filter((item) => isNewUpdate(item.update.publishedAt, seenAt)).length;
}

export function windowStart(now: Date, days: number): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

const toolCache = new Map<string, Promise<NotificationTool | null>>();

function loadTool(toolId: string): Promise<NotificationTool | null> {
  const cached = toolCache.get(toolId);
  if (cached) return cached;
  const pending = getDoc(doc(clientDb(), COLLECTIONS.tools, toolId))
    .then((snap) => {
      const tool = snap.exists() ? parseDoc(toolSchema, snap.id, snap.data()) : null;
      return tool?.published ? { id: tool.id, name: tool.name, logo: tool.logo } : null;
    })
    .catch(() => {
      toolCache.delete(toolId);
      return null;
    });
  toolCache.set(toolId, pending);
  return pending;
}

async function loadFeed(toolIds: readonly string[]): Promise<NotificationItemData[]> {
  if (toolIds.length === 0) return [];
  const since = windowStart(new Date(), NOTIFICATION_WINDOW_DAYS);
  const chunks = await Promise.all(
    chunk(toolIds, FIRESTORE_IN_LIMIT).map(async (ids) => {
      const snap = await getDocs(
        query(
          collectionGroup(clientDb(), SUBCOLLECTIONS.updates),
          where('toolId', 'in', ids),
          where('publishedAt', '>=', since),
          orderBy('publishedAt', 'desc'),
        ),
      );
      return parseDocs(toolUpdateSchema, snap.docs);
    }),
  );
  const updates = mergeUpdates(chunks);
  const distinct = [...new Set(updates.map((update) => update.toolId))];
  const tools = new Map(
    (await Promise.all(distinct.map(loadTool))).flatMap((tool) => (tool ? [[tool.id, tool]] : [])),
  );
  return updates.flatMap((update) => {
    const tool = tools.get(update.toolId);
    return tool ? [{ update, tool }] : [];
  });
}

const savedRef = (uid: string) =>
  collection(clientDb(), COLLECTIONS.users, uid, SUBCOLLECTIONS.saved);

const notificationsApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    notificationSavedIds: build.query<string[], string>({
      queryFn: (uid) =>
        firestoreCall(async () =>
          (await getDocs(savedRef(uid))).docs.map((snap) => snap.id).sort(),
        ),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(uid, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded;
        } catch {
          return;
        }
        const unsubscribe = onSnapshot(
          savedRef(uid),
          (snap) => {
            const ids = snap.docs.map((entry) => entry.id).sort();
            updateCachedData((current) =>
              current.length === ids.length && current.every((id, index) => id === ids[index])
                ? current
                : ids,
            );
          },
          (error) => console.warn(`Saved listener for ${uid} stopped`, error.code),
        );
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    notificationFeed: build.query<NotificationItemData[], string[]>({
      queryFn: (toolIds) => firestoreCall(() => loadFeed(toolIds)),
      providesTags: ['Notification'],
    }),
    markNotificationsRead: build.mutation<null, string>({
      queryFn: (uid) =>
        firestoreCall(async () => {
          await updateDoc(doc(clientDb(), COLLECTIONS.users, uid), {
            notificationsSeenAt: serverTimestamp(),
          });
          return null;
        }),
    }),
  }),
});

export const {
  useNotificationSavedIdsQuery,
  useNotificationFeedQuery,
  useMarkNotificationsReadMutation,
} = notificationsApi;
