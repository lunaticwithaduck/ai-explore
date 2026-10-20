export const COLLECTIONS = {
  tools: 'tools',
  categories: 'categories',
  bundles: 'bundles',
  config: 'config',
  admins: 'admins',
  users: 'users',
} as const;

export const SUBCOLLECTIONS = {
  updates: 'updates',
  reviews: 'reviews',
  votes: 'votes',
  saved: 'saved',
  collections: 'collections',
  bundleInterest: 'bundleInterest',
  subscriptions: 'subscriptions',
} as const;

export const APP_CONFIG_DOC = 'app';
export const NOTIFICATION_WINDOW_DAYS = 30;
export const FIRESTORE_IN_LIMIT = 30;
