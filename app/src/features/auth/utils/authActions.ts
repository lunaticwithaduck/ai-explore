import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
  updateProfile,
} from 'firebase/auth';
import { waitForPendingWrites } from 'firebase/firestore';
import type { Locale } from '@/i18n/routing';
import { clientAuth, clientDb } from '@/lib/firebase/client';
import { DISPLAY_NAME_MAX_LENGTH } from '../config/constants';
import type { AuthUser } from '../state/authSlice';
import { clipDisplayName } from './displayName';

export type SignUpInput = { displayName: string; email: string; password: string };

export const toAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName ? clipDisplayName(user.displayName, DISPLAY_NAME_MAX_LENGTH) : null,
  photoUrl: user.photoURL,
});

export const subscribeToAuth = (listener: (user: AuthUser | null) => void) =>
  onAuthStateChanged(clientAuth(), (user) => listener(user ? toAuthUser(user) : null));

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const { user } = await signInWithEmailAndPassword(clientAuth(), email, password);
  return toAuthUser(user);
}

export async function signInWithGoogle(locale: Locale): Promise<AuthUser> {
  const auth = clientAuth();
  auth.languageCode = locale;
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  return toAuthUser(user);
}

export async function signUpWithEmail({
  displayName,
  email,
  password,
}: SignUpInput): Promise<AuthUser> {
  const { user } = await createUserWithEmailAndPassword(clientAuth(), email, password);
  await updateProfile(user, { displayName });
  return { ...toAuthUser(user), displayName };
}

export async function requestPasswordReset(email: string, locale: Locale): Promise<void> {
  const auth = clientAuth();
  auth.languageCode = locale;
  await sendPasswordResetEmail(auth, email);
}

export const SIGN_OUT_WRITES_TIMEOUT_MS = 5000;

export type SignOutResult = 'clean' | 'timedOut';

export async function signOutUser(
  timeoutMs: number = SIGN_OUT_WRITES_TIMEOUT_MS,
): Promise<SignOutResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expiry = new Promise<'timedOut'>((resolve) => {
    timer = setTimeout(() => resolve('timedOut'), timeoutMs);
  });
  const settled = waitForPendingWrites(clientDb()).then(
    () => 'clean' as const,
    () => 'timedOut' as const,
  );
  const result = await Promise.race([settled, expiry]);
  clearTimeout(timer);
  await signOut(clientAuth());
  return result;
}
