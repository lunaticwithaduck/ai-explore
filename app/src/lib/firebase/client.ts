import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, type Firestore, getFirestore } from 'firebase/firestore';
import { useEmulators } from '@/config/env';
import { authEmulatorPort, emulatorHost, firebaseOptions, firestoreEmulatorPort } from './config';

const CLIENT_APP = 'client';

let auth: Auth | undefined;
let db: Firestore | undefined;

function clientApp(): FirebaseApp {
  return getApps().some((app) => app.name === CLIENT_APP)
    ? getApp(CLIENT_APP)
    : initializeApp(firebaseOptions, CLIENT_APP);
}

export function clientAuth(): Auth {
  if (!auth) {
    auth = getAuth(clientApp());
    if (useEmulators) {
      connectAuthEmulator(auth, `http://${emulatorHost}:${authEmulatorPort}`, {
        disableWarnings: true,
      });
    }
  }
  return auth;
}

export function clientDb(): Firestore {
  if (!db) {
    db = getFirestore(clientApp());
    if (useEmulators) connectFirestoreEmulator(db, emulatorHost, firestoreEmulatorPort);
  }
  return db;
}
