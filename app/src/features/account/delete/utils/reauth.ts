import {
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  type User,
} from 'firebase/auth';

export type ReauthMethod = 'password' | 'google';

export const reauthMethodOf = (user: User): ReauthMethod =>
  user.providerData.some(({ providerId }) => providerId === EmailAuthProvider.PROVIDER_ID)
    ? 'password'
    : 'google';

export async function reauthenticateUser(user: User, password: string | null): Promise<void> {
  if (password !== null && user.email) {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
    return;
  }
  await reauthenticateWithPopup(user, new GoogleAuthProvider());
}
