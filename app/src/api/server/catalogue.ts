import {
  APP_CONFIG_DOC,
  type AppConfig,
  appConfigSchema,
  type Bundle,
  bundleSchema,
  type Category,
  COLLECTIONS,
  categorySchema,
  type Tool,
  toolSchema,
  type WithId,
} from '@ai-explore/schemas';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
import { cache } from 'react';
import { serverDb } from '@/lib/firebase/lite';
import { parseDoc, parseDocs } from '@/lib/firebase/parse';

export const getPublishedTools = cache(async (): Promise<WithId<Tool>[]> => {
  const snap = await getDocs(
    query(collection(serverDb(), COLLECTIONS.tools), where('published', '==', true)),
  );
  return parseDocs(toolSchema, snap.docs).sort((a, b) => a.name.localeCompare(b.name));
});

export const getTool = cache(async (slug: string): Promise<WithId<Tool> | null> => {
  const tools = await getPublishedTools();
  return tools.find((tool) => tool.id === slug) ?? null;
});

export const getCategories = cache(async (): Promise<WithId<Category>[]> => {
  const snap = await getDocs(collection(serverDb(), COLLECTIONS.categories));
  return parseDocs(categorySchema, snap.docs).sort((a, b) => a.order - b.order);
});

export const getPublishedBundles = cache(async (): Promise<WithId<Bundle>[]> => {
  const snap = await getDocs(
    query(collection(serverDb(), COLLECTIONS.bundles), where('published', '==', true)),
  );
  return parseDocs(bundleSchema, snap.docs);
});

export const getBundle = cache(async (slug: string): Promise<WithId<Bundle> | null> => {
  const bundles = await getPublishedBundles();
  return bundles.find((bundle) => bundle.id === slug) ?? null;
});

export const getAppConfig = cache(async (): Promise<AppConfig | null> => {
  const snap = await getDoc(doc(serverDb(), COLLECTIONS.config, APP_CONFIG_DOC));
  return snap.exists() ? parseDoc(appConfigSchema, snap.id, snap.data()) : null;
});
