import { COLLECTIONS } from '@ai-explore/schemas';
import { type DocumentData, doc, getDoc, runTransaction } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';

const toolRef = (slug: string) => doc(clientDb(), COLLECTIONS.tools, slug);

export async function toolExistsOnServer(slug: string): Promise<boolean> {
  const snap = await getDoc(toolRef(slug));
  return snap.exists();
}

export async function createToolOnce(slug: string, data: DocumentData): Promise<void> {
  await runTransaction(clientDb(), async (transaction) => {
    const ref = toolRef(slug);
    const existing = await transaction.get(ref);
    if (existing.exists()) {
      throw Object.assign(new Error('Tool exists'), { code: 'already-exists' });
    }
    transaction.set(ref, data);
  });
}
