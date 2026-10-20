import {
  appConfigSchema,
  bundleSchema,
  categorySchema,
  reviewSchema,
  toolSchema,
  toolUpdateSchema,
  userProfileSchema,
} from '@ai-explore/schemas';
import type { SeedData } from './types';

type Parser<T> = {
  safeParse: (
    value: unknown,
  ) => { success: true; data: T } | { success: false; error: { message: string } };
};

export const E2E_MEMBER_CREATED_AT = new Date('2026-01-01T00:00:00.000Z');

export function updateId(version: string): string {
  return `v${version.replaceAll('.', '-')}`;
}

function parseAll<T>(
  schema: Parser<T>,
  label: string,
  values: Record<string, unknown>,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      const result = schema.safeParse(value);
      if (!result.success) {
        throw new Error(`${label}/${key}: ${result.error.message}`);
      }
      return [key, result.data];
    }),
  );
}

function parseGroup<T>(
  schema: Parser<T>,
  label: string,
  groups: Record<string, unknown[]>,
): Record<string, T[]> {
  return Object.fromEntries(
    Object.entries(groups).map(([key, list]) => [
      key,
      Object.values(parseAll(schema, `${label}/${key}`, { ...list })),
    ]),
  );
}

export function validateSeed(seed: SeedData): SeedData {
  const tools = parseAll(toolSchema, 'tools', seed.tools);
  for (const key of Object.keys(tools)) {
    if (tools[key]?.slug !== key) throw new Error(`tools/${key}: key differs from slug`);
  }
  return {
    categories: parseAll(categorySchema, 'categories', seed.categories),
    tools,
    updates: parseGroup(toolUpdateSchema, 'updates', seed.updates),
    reviews: parseGroup(reviewSchema, 'reviews', seed.reviews),
    bundles: parseAll(bundleSchema, 'bundles', seed.bundles),
    appConfig: appConfigSchema.parse(seed.appConfig),
  };
}

export function memberProfile() {
  return userProfileSchema.parse({
    displayName: 'Mila Member',
    photoUrl: null,
    locale: 'en',
    prefs: { productUpdates: false, emailDigest: false },
    notificationsSeenAt: null,
    createdAt: E2E_MEMBER_CREATED_AT,
  });
}
