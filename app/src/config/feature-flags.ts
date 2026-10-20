export const FEATURE_FLAGS = {
  checkoutEnabled: {
    default: false,
    description: 'Shows Subscribe on bundles instead of Notify me (SPEC §10).',
  },
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;
export type FeatureFlagMap = Record<FeatureFlagKey, boolean>;

export const FLAG_LOAD_TIMEOUT_MS = 500;

export function defaultFlags(): FeatureFlagMap {
  return { checkoutEnabled: FEATURE_FLAGS.checkoutEnabled.default };
}
