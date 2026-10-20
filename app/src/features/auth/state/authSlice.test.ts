import { describe, expect, it } from 'vitest';
import { makeStore } from '@/api/store';
import { type AuthUser, authSlice, authStateChanged, selectAuth, userUpdated } from './authSlice';

const user: AuthUser = {
  uid: 'u1',
  email: 'ada@example.com',
  displayName: null,
  photoUrl: null,
};

const reduce = authSlice.reducer;

describe('authSlice', () => {
  it('starts loading with no user', () => {
    expect(reduce(undefined, { type: '@@init' })).toEqual({ status: 'loading', user: null });
  });

  it('signs in with the user from the auth listener', () => {
    expect(reduce(undefined, authStateChanged(user))).toEqual({ status: 'signedIn', user });
  });

  it('signs out and clears the user', () => {
    const signedIn = reduce(undefined, authStateChanged(user));
    expect(reduce(signedIn, authStateChanged(null))).toEqual({ status: 'signedOut', user: null });
  });

  it('patches the signed-in user after a profile update', () => {
    const signedIn = reduce(undefined, authStateChanged(user));
    expect(reduce(signedIn, userUpdated({ displayName: 'Ada' })).user).toEqual({
      ...user,
      displayName: 'Ada',
    });
  });

  it('ignores a patch while signed out', () => {
    const signedOut = reduce(undefined, authStateChanged(null));
    expect(reduce(signedOut, userUpdated({ displayName: 'Ada' }))).toEqual(signedOut);
  });

  it('is injected into the root reducer and selectable from the store', () => {
    const store = makeStore();
    expect(selectAuth(store.getState())).toEqual({ status: 'loading', user: null });
    store.dispatch(authStateChanged(user));
    expect(selectAuth(store.getState())).toEqual({ status: 'signedIn', user });
  });
});
