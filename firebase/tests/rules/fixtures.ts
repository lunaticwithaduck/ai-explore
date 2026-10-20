import type { RulesTestContext, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import {
  collection,
  type DocumentData,
  doc,
  type Firestore,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach } from 'vitest';
import { createRulesEnvironment } from './environment';

export const ADMIN = 'admin-ada';
export const ALICE = 'alice';
export const BOB = 'bob';
export const CAROL = 'carol';

export type RulesHarness = {
  as: (uid: string) => Firestore;
  visitor: () => Firestore;
  seed: (docs: Record<string, DocumentData>) => Promise<void>;
  read: (path: string) => Promise<DocumentData | undefined>;
  readAll: (collectionPath: string) => Promise<DocumentData[]>;
};

function firestoreOf(context: RulesTestContext): Firestore {
  return context.firestore() as unknown as Firestore;
}

export function useRules(): RulesHarness {
  let env: RulesTestEnvironment | undefined;

  const current = (): RulesTestEnvironment => {
    if (!env) throw new Error('rules environment is not initialised');
    return env;
  };

  const withoutRules = (work: (db: Firestore) => Promise<void>) =>
    current().withSecurityRulesDisabled((context) => work(firestoreOf(context)));

  beforeAll(async () => {
    env = await createRulesEnvironment();
  });

  beforeEach(async () => {
    await current().clearFirestore();
  });

  afterAll(async () => {
    await env?.cleanup();
  });

  return {
    as: (uid) => firestoreOf(current().authenticatedContext(uid)),
    visitor: () => firestoreOf(current().unauthenticatedContext()),
    seed: (docs) =>
      withoutRules(async (db) => {
        for (const [path, data] of Object.entries(docs)) await setDoc(doc(db, path), data);
      }),
    read: async (path) => {
      let data: DocumentData | undefined;
      await withoutRules(async (db) => {
        data = (await getDoc(doc(db, path))).data();
      });
      return data;
    },
    readAll: async (collectionPath) => {
      let rows: DocumentData[] = [];
      await withoutRules(async (db) => {
        rows = (await getDocs(collection(db, collectionPath))).docs.map((snap) => snap.data());
      });
      return rows;
    },
  };
}
