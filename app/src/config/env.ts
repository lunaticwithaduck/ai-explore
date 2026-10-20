import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => (value === '' ? undefined : value);
const optionalString = z.preprocess(emptyStringToUndefined, z.string().optional());
const port = (fallback: number) =>
  z.preprocess(emptyStringToUndefined, z.coerce.number().int().positive().default(fallback));

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    emptyStringToUndefined,
    z.url().default('http://localhost:3000'),
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.preprocess(
    emptyStringToUndefined,
    z.string().default('demo-ai-explore'),
  ),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().default('demo-api-key'),
  ),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: optionalString,
  NEXT_PUBLIC_FIREBASE_APP_ID: optionalString,
  NEXT_PUBLIC_USE_EMULATORS: z.preprocess(
    emptyStringToUndefined,
    z.enum(['true', 'false']).default('true'),
  ),
  NEXT_PUBLIC_EMULATOR_HOST: z.preprocess(emptyStringToUndefined, z.string().default('127.0.0.1')),
  NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT: port(8080),
  NEXT_PUBLIC_AUTH_EMULATOR_PORT: port(9099),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_USE_EMULATORS: process.env.NEXT_PUBLIC_USE_EMULATORS,
  NEXT_PUBLIC_EMULATOR_HOST: process.env.NEXT_PUBLIC_EMULATOR_HOST,
  NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT: process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT,
  NEXT_PUBLIC_AUTH_EMULATOR_PORT: process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT,
});

export const useEmulators = env.NEXT_PUBLIC_USE_EMULATORS === 'true';
