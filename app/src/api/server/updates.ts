import {
  COLLECTIONS,
  SUBCOLLECTIONS,
  type ToolUpdate,
  toolUpdateSchema,
  type WithId,
} from '@ai-explore/schemas';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore/lite';
import { cache } from 'react';
import { serverDb } from '@/lib/firebase/lite';
import { parseDocs } from '@/lib/firebase/parse';

export const TOOL_UPDATES_LIMIT = 20;

export const getToolUpdates = cache(async (slug: string): Promise<WithId<ToolUpdate>[]> => {
  const snap = await getDocs(
    query(
      collection(serverDb(), COLLECTIONS.tools, slug, SUBCOLLECTIONS.updates),
      orderBy('publishedAt', 'desc'),
      limit(TOOL_UPDATES_LIMIT),
    ),
  );
  return parseDocs(toolUpdateSchema, snap.docs);
});
