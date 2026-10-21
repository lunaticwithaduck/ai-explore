import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProfileDoc } from '@/api/endpoints/profile';
import type { AuthState } from '../state/authSlice';
import type { CurrentProfileState } from './useCurrentProfile';
import { holdProfileCreation, useEnsureProfile } from './useEnsureProfile';

const ensureProfile = vi.hoisted(() => vi.fn());
const auth = vi.hoisted(() => ({ current: { status: 'loading', user: null } as AuthState }));
const current = vi.hoisted(() => ({
  profile: { profile: undefined, isLoaded: false } as CurrentProfileState,
}));

vi.mock('@/api/endpoints/profile', () => ({
  useEnsureProfileMutation: () => [ensureProfile],
}));
vi.mock('./useCurrentUser', () => ({ useCurrentUser: () => auth.current }));
vi.mock('./useCurrentProfile', () => ({ useCurrentProfile: () => current.profile }));
vi.mock('./useAppLocale', () => ({ useAppLocale: () => 'en' }));

const ada = { uid: 'u1', email: 'ada@example.com', displayName: 'Ada', photoUrl: null };
const adaProfile = { id: 'u1', displayName: 'Ada' } as ProfileDoc;

const signedIn = () => {
  auth.current = { status: 'signedIn', user: ada };
};
const profileIs = (profile: ProfileDoc | null | undefined) => {
  current.profile = { profile, isLoaded: profile !== undefined };
};

describe('useEnsureProfile', () => {
  beforeEach(() => {
    ensureProfile.mockReset();
    auth.current = { status: 'loading', user: null };
    profileIs(undefined);
  });

  it('creates the profile once on a first sign-in with no profile', () => {
    signedIn();
    profileIs(undefined);
    const { rerender } = renderHook(() => useEnsureProfile());
    expect(ensureProfile).not.toHaveBeenCalled();
    profileIs(null);
    rerender();
    rerender();
    expect(ensureProfile).toHaveBeenCalledTimes(1);
    expect(ensureProfile).toHaveBeenCalledWith({
      uid: 'u1',
      displayName: 'Ada',
      photoUrl: null,
      locale: 'en',
    });
  });

  it('does not re-create a profile that was seen and then removed', () => {
    signedIn();
    profileIs(adaProfile);
    const { rerender } = renderHook(() => useEnsureProfile());
    profileIs(null);
    rerender();
    expect(ensureProfile).not.toHaveBeenCalled();
  });

  it('does not create a profile while its creation is held', () => {
    signedIn();
    const release = holdProfileCreation('u1');
    profileIs(null);
    const { rerender } = renderHook(() => useEnsureProfile());
    expect(ensureProfile).not.toHaveBeenCalled();
    release();
    profileIs(undefined);
    rerender();
    profileIs(null);
    rerender();
    expect(ensureProfile).toHaveBeenCalledTimes(1);
  });
});
