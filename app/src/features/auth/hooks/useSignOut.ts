import { useCallback, useState, useSyncExternalStore } from 'react';
import { signOutUser } from '../utils/authActions';

const WARNING_VISIBLE_MS = 10000;

const listeners = new Set<() => void>();
let warningVisible = false;
let warningTimer: ReturnType<typeof setTimeout> | undefined;

export function setSignOutWarning(visible: boolean): void {
  clearTimeout(warningTimer);
  if (warningVisible === visible) return;
  warningVisible = visible;
  if (visible) warningTimer = setTimeout(() => setSignOutWarning(false), WARNING_VISIBLE_MS);
  for (const listener of listeners) listener();
}

const subscribeWarning = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSignOutWarning = () => warningVisible;

export type SignOutFlow = {
  signOut: () => Promise<void>;
  isSaving: boolean;
};

export function useSignOutFlow(): SignOutFlow {
  const [isSaving, setIsSaving] = useState(false);
  const signOut = useCallback(async () => {
    setIsSaving(true);
    setSignOutWarning(false);
    try {
      if ((await signOutUser()) === 'timedOut') setSignOutWarning(true);
    } finally {
      setIsSaving(false);
    }
  }, []);
  return { signOut, isSaving };
}

export function useSignOut(): () => Promise<void> {
  return useSignOutFlow().signOut;
}

export function useSignOutWarning(): boolean {
  return useSyncExternalStore(subscribeWarning, getSignOutWarning, () => false);
}
