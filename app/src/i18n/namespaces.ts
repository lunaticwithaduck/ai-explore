export const NAMESPACES = [
  'common',
  'errors',
  'system',
  'shell',
  'auth',
  'library',
  'tool',
  'bundles',
  'compare',
  'share',
  'reviews',
  'myLibrary',
  'notifications',
  'account',
  'admin',
  'bundleInterest',
  'dev',
  'seo',
] as const;

export type Namespace = (typeof NAMESPACES)[number];
