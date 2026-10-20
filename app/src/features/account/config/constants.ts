export const RECENT_REVIEWS_LIMIT = 5;

export const NOTIFICATION_PREFS = ['productUpdates', 'emailDigest'] as const;

export type NotificationPref = (typeof NOTIFICATION_PREFS)[number];

export const PROFILE_STATS = ['saved', 'collections', 'reviews'] as const;
