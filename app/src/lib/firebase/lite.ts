import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, type Firestore, getFirestore } from 'firebase/firestore/lite';
import { useEmulators } from '@/config/env';
import { emulatorHost, firebaseOptions, firestoreEmulatorPort } from './config';

const SERVER_APP = 'server';

let db: Firestore | undefined;

function serverApp(): FirebaseApp {
  return getApps().some((app) => app.name === SERVER_APP)
    ? getApp(SERVER_APP)
    : initializeApp(firebaseOptions, SERVER_APP);
}

export function serverDb(): Firestore {
  if (!db) {
    db = getFirestore(serverApp());
    if (useEmulators) connectFirestoreEmulator(db, emulatorHost, firestoreEmulatorPort);
  }
  return db;
}
