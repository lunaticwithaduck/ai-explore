import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { useSavedIdsQuery } from '@/api/endpoints/myLibrary';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useHydrated } from './useHydrated';

export type SavedTools = {
  uid: string | null;
  signedOut: boolean;
  loaded: boolean;
  ids: ReadonlySet<string>;
};

export function useSavedTools(): SavedTools {
  const hydrated = useHydrated();
  const { status, user } = useCurrentUser();
  const uid = hydrated ? (user?.uid ?? null) : null;
  const { data } = useSavedIdsQuery(uid ?? skipToken);
  const ids = useMemo(() => new Set(data ?? []), [data]);
  return { uid, signedOut: hydrated && status === 'signedOut', loaded: data !== undefined, ids };
}
