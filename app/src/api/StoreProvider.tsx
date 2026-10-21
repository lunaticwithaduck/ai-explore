'use client';

import { type ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './store';

type StoreProviderProps = {
  children: ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState(makeStore);
  const [serverState] = useState(() => store.getState());
  return (
    <Provider store={store} serverState={serverState}>
      {children}
    </Provider>
  );
}
