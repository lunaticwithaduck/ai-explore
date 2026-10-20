import { APP_ERROR_CODES, type AppErrorCode } from '@/api/errors';

export function errorCode(error: unknown): AppErrorCode {
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null;
  return APP_ERROR_CODES.find((known) => known === code) ?? 'unknown';
}
