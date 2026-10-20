'use client';

import { createContext, type ReactNode, useContext } from 'react';
import { defaultFlags, type FeatureFlagKey, type FeatureFlagMap } from '@/config/feature-flags';

const FlagContext = createContext<FeatureFlagMap>(defaultFlags());

type FeatureFlagProviderProps = {
  flags: FeatureFlagMap;
  children: ReactNode;
};

export function FeatureFlagProvider({ flags, children }: FeatureFlagProviderProps) {
  return <FlagContext.Provider value={flags}>{children}</FlagContext.Provider>;
}

export function useFlag(key: FeatureFlagKey): boolean {
  return useContext(FlagContext)[key];
}
