import { useTranslations } from 'next-intl';
import type { AppErrorCode } from '@/api/errors';
import { AuthAlert } from '@/features/auth/components/AuthAlert/AuthAlert';

export type QueryNoticeProps = {
  error: unknown;
};

const isAppError = (error: unknown): error is { code: AppErrorCode } =>
  typeof error === 'object' && error !== null && 'code' in error;

export function QueryNotice({ error }: QueryNoticeProps) {
  const t = useTranslations('errors');
  if (!error) return null;
  return <AuthAlert message={t(isAppError(error) ? error.code : 'unknown')} />;
}
