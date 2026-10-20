import { useCallback } from 'react';
import { signOutUser } from '../utils/authActions';

export function useSignOut(): () => Promise<void> {
  return useCallback(() => signOutUser(), []);
}
