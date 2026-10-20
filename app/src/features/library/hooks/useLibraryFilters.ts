'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { EMPTY_FILTERS, type LibraryFilters, parseFilters, toQuery } from '../utils/libraryFilters';

export function useLibraryFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const key = params.toString();
  const filters = useMemo(() => parseFilters(new URLSearchParams(key)), [key]);

  const update = useCallback(
    (patch: Partial<LibraryFilters>) => {
      router.replace(routes.libraryWith(toQuery({ ...filters, ...patch })), { scroll: false });
    },
    [filters, router],
  );

  const reset = useCallback(() => update(EMPTY_FILTERS), [update]);

  return { filters, update, reset };
}
