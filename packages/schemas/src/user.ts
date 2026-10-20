import { z } from 'zod';
import { bundlePeriodSchema } from './bundle';
import { ACCENTS, localeSchema, slugSchema, timestampSchema } from './common';

export const COLLECTION_ICONS = [
  'folder',
  'briefcase',
  'palette',
  'code',
  'pen-tool',
  'video',
  'music',
  'chart-bar',
  'sparkles',
  'rocket',
  'heart',
  'star',
  'bookmark',
  'zap',
  'graduation-cap',
  'camera',
] as const;

export const COLLECTION_LIMITS = { nameMin: 1, nameMax: 40, toolIdsMax: 50 } as const;
export const DISPLAY_NAME_MAX = 60;

export const userProfileSchema = z.object({
  displayName: z.string().min(1).max(DISPLAY_NAME_MAX),
  photoUrl: z.url().nullable(),
  locale: localeSchema,
  prefs: z.object({
    productUpdates: z.boolean(),
    emailDigest: z.boolean(),
  }),
  notificationsSeenAt: timestampSchema.nullable(),
  createdAt: timestampSchema,
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const savedToolSchema = z.object({
  savedAt: timestampSchema,
});

export type SavedTool = z.infer<typeof savedToolSchema>;

export const userCollectionSchema = z.object({
  name: z.string().trim().min(COLLECTION_LIMITS.nameMin).max(COLLECTION_LIMITS.nameMax),
  icon: z.enum(COLLECTION_ICONS),
  color: z.enum(ACCENTS),
  toolIds: z.array(slugSchema).max(COLLECTION_LIMITS.toolIdsMax),
  order: z.number().int().nonnegative(),
  createdAt: timestampSchema,
});

export type UserCollection = z.infer<typeof userCollectionSchema>;

export const bundleInterestSchema = z.object({
  period: bundlePeriodSchema,
  createdAt: timestampSchema,
});

export type BundleInterest = z.infer<typeof bundleInterestSchema>;

export const SUBSCRIPTION_STATUSES = ['active', 'past_due', 'canceled'] as const;

export const subscriptionSchema = z.object({
  bundleId: slugSchema,
  period: bundlePeriodSchema,
  status: z.enum(SUBSCRIPTION_STATUSES),
  currentPeriodEnd: timestampSchema,
});

export type Subscription = z.infer<typeof subscriptionSchema>;
