export const APP_ERROR_CODES = [
  'permission-denied',
  'unauthenticated',
  'not-found',
  'already-exists',
  'unavailable',
  'invalid-data',
  'unknown',
] as const;

export type AppErrorCode = (typeof APP_ERROR_CODES)[number];

export type AppError = {
  code: AppErrorCode;
  message: string;
};

const FIREBASE_CODE_MAP: Record<string, AppErrorCode> = {
  'permission-denied': 'permission-denied',
  unauthenticated: 'unauthenticated',
  'not-found': 'not-found',
  'already-exists': 'already-exists',
  unavailable: 'unavailable',
  'deadline-exceeded': 'unavailable',
  'invalid-argument': 'invalid-data',
  'failed-precondition': 'invalid-data',
};

export function toAppError(error: unknown): AppError {
  const rawCode =
    typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  const code = FIREBASE_CODE_MAP[rawCode.replace(/^firestore\//, '')] ?? 'unknown';
  const message = error instanceof Error ? error.message : String(error);
  return { code, message };
}
