import type { Firestore } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import type { AppErrorCode } from '@/api/errors';
import { firestoreCall } from '@/api/firestoreCall';
import { clientDb } from '@/lib/firebase/client';

export type BatchActionState = {
  pending: boolean;
  error: AppErrorCode | null;
};

export function useBatchAction() {
  const [state, setState] = useState<BatchActionState>({ pending: false, error: null });

  const run = useCallback(async (write: (db: Firestore) => Promise<void>) => {
    setState({ pending: true, error: null });
    const result = await firestoreCall(() => write(clientDb()));
    const error = 'error' in result ? result.error.code : null;
    setState({ pending: false, error });
    return error === null;
  }, []);

  const clearError = useCallback(() => setState((current) => ({ ...current, error: null })), []);

  return { ...state, run, clearError };
}
