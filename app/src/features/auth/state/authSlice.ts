import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { rootReducer } from '@/api/rootReducer';
import type { AppState } from '@/api/store';

export type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
};

export type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
};

export type AuthUserPatch = Partial<Omit<AuthUser, 'uid'>>;

const initialState: AuthState = { status: 'loading', user: null };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStateChanged: (_state, action: PayloadAction<AuthUser | null>): AuthState =>
      action.payload
        ? { status: 'signedIn', user: action.payload }
        : { status: 'signedOut', user: null },
    userUpdated: (state, action: PayloadAction<AuthUserPatch>) => {
      if (state.user) Object.assign(state.user, action.payload);
    },
  },
});

export const injectedAuthSlice = authSlice.injectInto(rootReducer);

export const { authStateChanged, userUpdated } = authSlice.actions;

type AppStateWithAuth = AppState & { auth?: AuthState };

export const selectAuth = (state: AppState): AuthState =>
  injectedAuthSlice.selectSlice(state as AppStateWithAuth);
