import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/api/store';
import { authStateChanged } from '@/features/auth/state/authSlice';
import { deleteAccount } from '../utils/deleteAccount';
import { reauthenticateUser } from '../utils/reauth';
import { useDeleteAccount } from './useDeleteAccount';

const firebaseUser = vi.hoisted(() => ({ uid: 'u1', email: 'ada@example.com' }));
const replace = vi.hoisted(() => vi.fn());
const signOut = vi.hoisted(() => vi.fn(() => Promise.resolve()));
const releaseHold = vi.hoisted(() => vi.fn());

vi.mock('@/lib/firebase/client', () => ({
  clientAuth: () => ({ currentUser: firebaseUser }),
  clientDb: () => ({}),
}));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/features/auth/hooks/useSignOut', () => ({ useSignOut: () => signOut }));
vi.mock('@/features/auth/hooks/useEnsureProfile', () => ({
  holdProfileCreation: () => releaseHold,
}));
vi.mock('../utils/deleteAccount', () => ({ deleteAccount: vi.fn() }));
vi.mock('../utils/reauth', () => ({
  reauthMethodOf: () => 'password',
  reauthenticateUser: vi.fn(),
}));

const deferred = () => {
  let resolve: () => void = () => {};
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

const renderController = () => {
  const store = makeStore();
  store.dispatch(
    authStateChanged({ uid: 'u1', email: 'ada@example.com', displayName: 'Ada', photoUrl: null }),
  );
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(() => useDeleteAccount(), { wrapper }).result;
};

describe('useDeleteAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(reauthenticateUser).mockResolvedValue();
    vi.mocked(deleteAccount).mockResolvedValue();
  });

  it('ignores an up-front reauth that settles after a cancel', async () => {
    const gate = deferred();
    vi.mocked(reauthenticateUser).mockReturnValueOnce(gate.promise);
    const result = renderController();
    let confirming: Promise<void> = Promise.resolve();
    act(() => {
      confirming = result.current.confirm('secret');
    });
    expect(result.current.busy).toBe(true);
    act(() => result.current.cancel());
    await act(async () => {
      gate.resolve();
      await confirming;
    });
    expect(deleteAccount).not.toHaveBeenCalled();
    expect(result.current.phase).toEqual({ name: 'confirm', pending: false, error: null });
    expect(result.current.busy).toBe(false);
  });

  it('ignores a late sign-in reauth once the fallback was cancelled', async () => {
    let deleting: Promise<void> = Promise.resolve();
    vi.mocked(deleteAccount).mockImplementation(async ({ onStep, reauthenticate }) => {
      onStep('account');
      deleting = reauthenticate();
      await deleting;
    });
    const result = renderController();
    await act(async () => {
      void result.current.confirm('secret');
    });
    expect(result.current.phase).toEqual({ name: 'finish', pending: false, error: null });

    const gate = deferred();
    vi.mocked(reauthenticateUser).mockReturnValueOnce(gate.promise);
    let finishing: Promise<void> = Promise.resolve();
    act(() => {
      finishing = result.current.finish('secret');
    });
    act(() => result.current.cancel());
    await act(async () => {
      await deleting.catch(() => {});
      gate.resolve();
      await finishing;
    });
    expect(result.current.signInRemains).toBe(true);
    expect(result.current.phase).toEqual({ name: 'confirm', pending: false, error: null });
    expect(deleteAccount).toHaveBeenCalledTimes(1);
    expect(signOut).not.toHaveBeenCalled();
    expect(releaseHold).toHaveBeenCalledTimes(1);
  });

  it('does not flag a remaining sign-in when an earlier step fails', async () => {
    vi.mocked(deleteAccount).mockImplementation(async ({ onStep }) => {
      onStep('reviews');
      throw Object.assign(new Error('denied'), { code: 'permission-denied' });
    });
    const result = renderController();
    await act(async () => {
      await result.current.confirm('secret');
    });
    expect(result.current.signInRemains).toBe(false);
    expect(result.current.phase).toEqual({
      name: 'confirm',
      pending: false,
      error: { scope: 'errors', key: 'permission-denied' },
    });
  });
});
