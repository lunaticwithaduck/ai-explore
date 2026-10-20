import { configureStore } from '@reduxjs/toolkit';
import { firestoreApi } from './firestoreApi';
import { rootReducer } from './rootReducer';

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) =>
      getDefault({ serializableCheck: false }).concat(firestoreApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
