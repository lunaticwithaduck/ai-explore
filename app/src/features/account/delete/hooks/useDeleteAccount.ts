import type { User } from 'firebase/auth';
import { useCallback, useMemo, useRef, useState } from 'react';
import { routes } from '@/config/routes';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { holdProfileCreation } from '@/features/auth/hooks/useEnsureProfile';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useRouter } from '@/i18n/navigation';
import { clientAuth, clientDb } from '@/lib/firebase/client';
import type { DeleteStep } from '../config/constants';
import { deleteAccount } from '../utils/deleteAccount';
import { type DeleteError, toDeleteError } from '../utils/deleteErrors';
import { type ReauthMethod, reauthenticateUser, reauthMethodOf } from '../utils/reauth';

export type DeletePhase =
  | { name: 'confirm' | 'finish'; pending: boolean; error: DeleteError | null }
  | { name: 'running'; step: DeleteStep | null };

type FallbackRequest = {
  user: User;
  resolve: () => void;
  reject: (reason: unknown) => void;
};

const IDLE: DeletePhase = { name: 'confirm', pending: false, error: null };
const SIGNED_OUT: DeleteError = { scope: 'errors', key: 'unauthenticated' };
const CANCELLED = Symbol('delete-account-cancelled');

export function useDeleteAccount() {
  const router = useRouter();
  const signOut = useSignOut();
  const { user: authUser } = useCurrentUser();
  const [phase, setPhase] = useState<DeletePhase>(IDLE);
  const [signInRemains, setSignInRemains] = useState(false);
  const attempt = useRef<object | null>(null);
  const fallback = useRef<FallbackRequest | null>(null);
  const lastStep = useRef<DeleteStep | null>(null);

  const method = useMemo<ReauthMethod>(() => {
    const current = clientAuth().currentUser;
    return current && current.uid === authUser?.uid ? reauthMethodOf(current) : 'password';
  }, [authUser]);

  const showStep = useCallback((step: DeleteStep | null) => {
    lastStep.current = step;
    setPhase({ name: 'running', step });
  }, []);

  const awaitFallback = useCallback(
    (user: User) =>
      new Promise<void>((resolve, reject) => {
        fallback.current = { user, resolve, reject };
        setPhase({ name: 'finish', pending: false, error: null });
      }),
    [],
  );

  const run = useCallback(
    async (user: User) => {
      const release = holdProfileCreation(user.uid);
      showStep(null);
      try {
        await deleteAccount({
          db: clientDb(),
          user,
          reauthenticate: () => awaitFallback(user),
          onStep: showStep,
        });
        await signOut();
        router.replace(routes.library);
      } catch (error) {
        const stoppedAtSignIn = lastStep.current === 'account';
        setSignInRemains((remains) => remains || stoppedAtSignIn);
        setPhase({
          name: 'confirm',
          pending: false,
          error: error === CANCELLED ? null : toDeleteError(error),
        });
      } finally {
        release();
      }
    },
    [awaitFallback, router, showStep, signOut],
  );

  const reauthenticate = useCallback(
    async (stage: 'confirm' | 'finish', password: string | null) => {
      const user = fallback.current?.user ?? clientAuth().currentUser;
      if (!user) {
        setPhase({ name: stage, pending: false, error: SIGNED_OUT });
        return;
      }
      const request = {};
      attempt.current = request;
      setPhase({ name: stage, pending: true, error: null });
      try {
        await reauthenticateUser(user, password);
      } catch (error) {
        if (attempt.current !== request) return;
        attempt.current = null;
        setPhase({ name: stage, pending: false, error: toDeleteError(error) });
        return;
      }
      if (attempt.current !== request) return;
      attempt.current = null;
      const waiting = fallback.current;
      if (waiting) {
        fallback.current = null;
        showStep(lastStep.current);
        waiting.resolve();
        return;
      }
      await run(user);
    },
    [run, showStep],
  );

  const confirm = useCallback(
    (password: string | null) => reauthenticate('confirm', password),
    [reauthenticate],
  );

  const finish = useCallback(
    (password: string | null) => reauthenticate('finish', password),
    [reauthenticate],
  );

  const resumeSignInDelete = useCallback(() => {
    setPhase({ name: 'finish', pending: false, error: null });
  }, []);

  const cancel = useCallback(() => {
    attempt.current = null;
    const waiting = fallback.current;
    fallback.current = null;
    setPhase(IDLE);
    waiting?.reject(CANCELLED);
  }, []);

  const busy = phase.name === 'running' || phase.pending;

  return { phase, method, busy, signInRemains, confirm, finish, resumeSignInDelete, cancel };
}

export type DeleteAccountController = ReturnType<typeof useDeleteAccount>;
