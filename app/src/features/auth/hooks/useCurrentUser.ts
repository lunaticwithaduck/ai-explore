import { useAppSelector } from '@/api/hooks';
import { type AuthState, selectAuth } from '../state/authSlice';

export function useCurrentUser(): AuthState {
  return useAppSelector(selectAuth);
}
