import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';

const RULES_PATH = fileURLToPath(new URL('../../firestore.rules', import.meta.url));

function emulatorAddress() {
  const raw = process.env.FIRESTORE_EMULATOR_HOST;
  if (!raw)
    throw new Error('FIRESTORE_EMULATOR_HOST is not set; run through scripts/test-rules.sh');
  const [host = '127.0.0.1', port = '8080'] = raw.split(':');
  return { host, port: Number(port) };
}

export function createRulesEnvironment(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: 'demo-ai-explore',
    firestore: { ...emulatorAddress(), rules: readFileSync(RULES_PATH, 'utf8') },
  });
}
