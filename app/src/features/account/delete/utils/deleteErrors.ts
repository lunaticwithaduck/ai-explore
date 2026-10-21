import { type AppErrorCode, toAppError } from '@/api/errors';
import { authErrorCode } from '@/features/auth/utils/authErrors';

export type DeleteErrorKey =
  | 'wrongPassword'
  | 'wrongGoogleAccount'
  | 'tooManyRequests'
  | 'popupBlocked';

export type DeleteError =
  | { scope: 'errors'; key: AppErrorCode }
  | { scope: 'delete'; key: DeleteErrorKey };

const accountError = (key: DeleteErrorKey): DeleteError => ({ scope: 'delete', key });
const appError = (key: AppErrorCode): DeleteError => ({ scope: 'errors', key });

const AUTH_ERRORS: Record<string, DeleteError | null> = {
  'auth/invalid-credential': accountError('wrongPassword'),
  'auth/invalid-login-credentials': accountError('wrongPassword'),
  'auth/wrong-password': accountError('wrongPassword'),
  'auth/missing-password': accountError('wrongPassword'),
  'auth/user-mismatch': accountError('wrongGoogleAccount'),
  'auth/too-many-requests': accountError('tooManyRequests'),
  'auth/popup-blocked': accountError('popupBlocked'),
  'auth/network-request-failed': appError('unavailable'),
  'auth/requires-recent-login': appError('unauthenticated'),
  'auth/user-token-expired': appError('unauthenticated'),
  'auth/popup-closed-by-user': null,
  'auth/cancelled-popup-request': null,
};

export function toDeleteError(error: unknown): DeleteError | null {
  const code = authErrorCode(error);
  if (Object.hasOwn(AUTH_ERRORS, code)) return AUTH_ERRORS[code] ?? null;
  return appError(toAppError(error).code);
}
