import type { Auth } from 'firebase-admin/auth';
import { E2E_ACCOUNTS } from './accounts';

export async function ensureAuthUsers(auth: Auth): Promise<void> {
  for (const account of Object.values(E2E_ACCOUNTS)) {
    const exists = await auth.getUser(account.uid).then(
      () => true,
      (error: { code?: string }) => {
        if (error.code === 'auth/user-not-found') return false;
        throw error;
      },
    );
    if (!exists) {
      await auth.createUser({
        uid: account.uid,
        email: account.email,
        password: account.password,
        displayName: account.displayName,
        emailVerified: true,
      });
    }
  }
}
