import { skipToken } from '@reduxjs/toolkit/query';
import { type CollectionDoc, useCollectionsQuery } from '@/api/endpoints/myLibrary';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useHydrated } from './useHydrated';

export type UserCollections = {
  uid: string | null;
  signedOut: boolean;
  loaded: boolean;
  collections: CollectionDoc[];
};

const NONE: CollectionDoc[] = [];

export function useUserCollections(): UserCollections {
  const hydrated = useHydrated();
  const { status, user } = useCurrentUser();
  const uid = hydrated ? (user?.uid ?? null) : null;
  const { data } = useCollectionsQuery(uid ?? skipToken);
  return {
    uid,
    signedOut: hydrated && status === 'signedOut',
    loaded: data !== undefined,
    collections: data ?? NONE,
  };
}
