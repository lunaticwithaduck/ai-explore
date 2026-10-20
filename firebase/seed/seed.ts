import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { ensureAuthUsers } from './auth';
import { seedData } from './data';
import { validateSeed } from './validate';
import { writeAccounts, writeCatalogue } from './writers';

const PROJECT_ID = 'demo-ai-explore';

async function main(): Promise<void> {
  const projectId = process.env.GCLOUD_PROJECT ?? process.env.GOOGLE_CLOUD_PROJECT;
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error('Refusing to seed: FIRESTORE_EMULATOR_HOST is not set');
  }
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error('Refusing to seed: FIREBASE_AUTH_EMULATOR_HOST is not set');
  }
  if (projectId !== PROJECT_ID) {
    throw new Error(`Refusing to seed: project must be ${PROJECT_ID}, got ${projectId ?? 'none'}`);
  }
  const seed = validateSeed(seedData);
  const app = getApps()[0] ?? initializeApp({ projectId: PROJECT_ID });
  await ensureAuthUsers(getAuth(app));
  const db = getFirestore(app);
  const written = await writeCatalogue(db, seed);
  await writeAccounts(db);
  process.stdout.write(`seed: wrote ${written} catalogue documents\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`seed failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
