export const RECENT_REVIEWS_LIMIT = 5;

export const SAVED_TOOLS_PREVIEW = 3;

export const NOTIFICATION_PREFS = ['productUpdates', 'emailDigest'] as const;

export type NotificationPref = (typeof NOTIFICATION_PREFS)[number];

export const PROFILE_STATS = ['saved', 'collections', 'memberSince', 'reviews'] as const;

export type ProfileStat = (typeof PROFILE_STATS)[number];
