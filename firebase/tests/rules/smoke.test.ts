import { assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc } from 'firebase/firestore';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { createRulesEnvironment } from './environment';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createRulesEnvironment();
});

afterAll(async () => {
  await env.cleanup();
});

describe('rules smoke', () => {
  it('loads the rules and evaluates a read', async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'smoke/probe')));
  });
});
