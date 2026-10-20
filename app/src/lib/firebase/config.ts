import type { FirebaseOptions } from 'firebase/app';
import { env } from '@/config/env';

export const firebaseOptions: FirebaseOptions = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain:
    env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    `${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  ...(env.NEXT_PUBLIC_FIREBASE_APP_ID ? { appId: env.NEXT_PUBLIC_FIREBASE_APP_ID } : {}),
};

export const emulatorHost = env.NEXT_PUBLIC_EMULATOR_HOST;
export const firestoreEmulatorPort = env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT;
export const authEmulatorPort = env.NEXT_PUBLIC_AUTH_EMULATOR_PORT;
