export const AUTH_ERROR_KEYS = [
  'invalidCredential',
  'emailInUse',
  'weakPassword',
  'invalidEmail',
  'userDisabled',
  'tooManyRequests',
  'network',
  'popupBlocked',
  'accountExists',
  'unknown',
] as const;

export type AuthErrorKey = (typeof AUTH_ERROR_KEYS)[number];

const CODE_MAP: Record<string, AuthErrorKey | null> = {
  'auth/invalid-credential': 'invalidCredential',
  'auth/invalid-login-credentials': 'invalidCredential',
  'auth/wrong-password': 'invalidCredential',
  'auth/user-not-found': 'invalidCredential',
  'auth/missing-password': 'invalidCredential',
  'auth/email-already-in-use': 'emailInUse',
  'auth/credential-already-in-use': 'emailInUse',
  'auth/weak-password': 'weakPassword',
  'auth/password-does-not-meet-requirements': 'weakPassword',
  'auth/invalid-email': 'invalidEmail',
  'auth/missing-email': 'invalidEmail',
  'auth/user-disabled': 'userDisabled',
  'auth/too-many-requests': 'tooManyRequests',
  'auth/network-request-failed': 'network',
  'auth/popup-blocked': 'popupBlocked',
  'auth/account-exists-with-different-credential': 'accountExists',
  'auth/popup-closed-by-user': null,
  'auth/cancelled-popup-request': null,
  'auth/user-cancelled': null,
};

export function authErrorCode(error: unknown): string {
  return typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
}

export function toAuthErrorKey(error: unknown): AuthErrorKey | null {
  const code = authErrorCode(error);
  return Object.hasOwn(CODE_MAP, code) ? (CODE_MAP[code] ?? null) : 'unknown';
}
