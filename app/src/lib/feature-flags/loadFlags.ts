import { appConfigSchema } from '@ai-explore/schemas';
import { cache } from 'react';
import { getAppConfig } from '@/api/server/catalogue';
import { defaultFlags, type FeatureFlagMap, FLAG_LOAD_TIMEOUT_MS } from '@/config/feature-flags';

const timeout = (ms: number) =>
  new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), ms);
  });

export const loadFlags = cache(async (): Promise<FeatureFlagMap> => {
  if (process.env.NEXT_PHASE === 'phase-production-build') return defaultFlags();
  const config = await Promise.race([
    getAppConfig().catch(() => null),
    timeout(FLAG_LOAD_TIMEOUT_MS),
  ]);
  const parsed = appConfigSchema.safeParse(config);
  return parsed.success ? { ...defaultFlags(), ...parsed.data } : defaultFlags();
});
