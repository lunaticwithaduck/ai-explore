import { skipToken } from '@reduxjs/toolkit/query';
import { useIsAdminQuery } from '@/api/endpoints/auth';
import { useCurrentUser } from './useCurrentUser';

export type IsAdminState = {
  isAdmin: boolean;
  isLoading: boolean;
};

export function useIsAdmin(): IsAdminState {
  const { status, user } = useCurrentUser();
  const uid = status === 'signedIn' && user ? user.uid : null;
  const { currentData, isError } = useIsAdminQuery(uid ?? skipToken);
  return {
    isAdmin: uid !== null && currentData === true,
    isLoading: status === 'loading' || (uid !== null && currentData === undefined && !isError),
  };
}
