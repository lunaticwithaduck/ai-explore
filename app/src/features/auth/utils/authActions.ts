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
import type { Locale } from '@/i18n/routing';
import { clientAuth } from '@/lib/firebase/client';
import type { AuthUser } from '../state/authSlice';

export type SignUpInput = { displayName: string; email: string; password: string };

export const toAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
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

export const signOutUser = () => signOut(clientAuth());
