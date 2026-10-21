import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import type { DeleteError } from '../utils/deleteErrors';

export function useDeleteErrorMessage() {
  const t = useTranslations('account');
  const tErrors = useTranslations('errors');
  return useCallback(
    (error: DeleteError) =>
      error.scope === 'errors' ? tErrors(error.key) : t(`delete.errors.${error.key}`),
    [t, tErrors],
  );
}
