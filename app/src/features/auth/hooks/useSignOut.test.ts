import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  signOut: vi.fn(async () => undefined),
  waitForPendingWrites: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: mocks.signOut,
  updateProfile: vi.fn(),
}));
vi.mock('firebase/firestore', () => ({ waitForPendingWrites: mocks.waitForPendingWrites }));
vi.mock('@/lib/firebase/client', () => ({ clientAuth: () => ({}), clientDb: () => ({}) }));

import { getSignOutWarning, setSignOutWarning, useSignOutFlow } from './useSignOut';

describe('useSignOutFlow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.signOut.mockClear();
    setSignOutWarning(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows saving while writes are pending, then signs out without a warning', async () => {
    let settle: () => void = () => undefined;
    mocks.waitForPendingWrites.mockReturnValue(new Promise<void>((resolve) => (settle = resolve)));
    const { result } = renderHook(() => useSignOutFlow());
    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.signOut();
    });
    expect(result.current.isSaving).toBe(true);
    expect(mocks.signOut).not.toHaveBeenCalled();
    await act(async () => {
      settle();
      await pending;
    });
    expect(mocks.signOut).toHaveBeenCalledTimes(1);
    expect(result.current.isSaving).toBe(false);
    expect(getSignOutWarning()).toBe(false);
  });

  it('signs out anyway after the timeout and raises the warning', async () => {
    mocks.waitForPendingWrites.mockReturnValue(new Promise(() => undefined));
    const { result } = renderHook(() => useSignOutFlow());
    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.signOut();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
      await pending;
    });
    expect(mocks.signOut).toHaveBeenCalledTimes(1);
    expect(getSignOutWarning()).toBe(true);
  });
});
