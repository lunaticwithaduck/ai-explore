import { skipToken } from '@reduxjs/toolkit/query';
import { type ProfileDoc, useProfileQuery } from '@/api/endpoints/profile';
import { useCurrentUser } from './useCurrentUser';

export type CurrentProfileState = {
  profile: ProfileDoc | null | undefined;
  isLoaded: boolean;
};

export function useCurrentProfile(): CurrentProfileState {
  const { status, user } = useCurrentUser();
  const uid = status === 'signedIn' && user ? user.uid : null;
  const { currentData, isSuccess } = useProfileQuery(uid ?? skipToken);
  return { profile: currentData, isLoaded: uid !== null && isSuccess && currentData !== undefined };
}
