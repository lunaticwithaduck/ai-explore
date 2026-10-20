import type {
  Bundle,
  BundlePeriod,
  Category,
  Review,
  Subscription,
  Tool,
  ToolUpdate,
  UserCollection,
  UserProfile,
} from '@ai-explore/schemas';
import { ACCENTS, COLLECTION_ICONS } from '@ai-explore/schemas';
import { type DocumentData, serverTimestamp } from 'firebase/firestore';

const SEEDED_AT = new Date('2026-01-15T10:00:00Z');
const localized = (en: string) => ({ en, bg: `${en} (bg)` });

export function toolDoc(slug: string, overrides: Partial<Tool> = {}): Tool {
  return {
    slug,
    name: `Tool ${slug}`,
    developer: 'Example Labs',
    websiteUrl: `https://example.com/${slug}`,
    tagline: localized('A tagline'),
    description: localized('A description'),
    categoryId: 'image',
    tags: ['image-generation'],
    logo: { path: `/logos/${slug}.png`, background: '#101820' },
    pricing: { hasFreePlan: false, fromPriceCents: 1000 },
    plans: [{ name: 'Basic', priceCents: 1000, period: 'month', features: [localized('Fast')] }],
    features: [localized('Feature')],
    tutorials: [],
    comparison: {
      apiAccess: 'limited',
      integrations: 3,
      speed: 4,
      outputQuality: 5,
      bestUseCase: localized('Concept art'),
    },
    similarToolIds: [],
    complementaryToolIds: [],
    rating: { count: 0, sum: 0 },
    published: true,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    lastReleaseAt: SEEDED_AT,
    ...overrides,
  };
}

export function bundleDoc(slug: string, overrides: Partial<Bundle> = {}): Bundle {
  return {
    slug,
    name: localized(`Bundle ${slug}`),
    description: localized('A bundle'),
    toolIds: ['midjourney', 'chatgpt'],
    icon: 'rocket',
    accent: 'violet',
    pricing: {
      monthly: { priceCents: 4900 },
      quarterly: { priceCents: 13900 },
      yearly: { priceCents: 49900 },
    },
    published: true,
    ...overrides,
  };
}

export function categoryDoc(order = 0): Category {
  return { name: localized('Image'), icon: 'image', order };
}

export function toolUpdateDoc(toolId: string): ToolUpdate {
  return {
    toolId,
    version: '7.1',
    kind: 'feature',
    title: localized('Faster renders'),
    changes: [localized('Renders twice as fast')],
    publishedAt: SEEDED_AT,
  };
}

export function reviewDoc(
  toolId: string,
  authorUid: string,
  rating: number,
  overrides: Partial<Review> = {},
): Review {
  return {
    toolId,
    authorUid,
    rating,
    body: 'Seeded review.',
    authorName: `User ${authorUid}`,
    authorPhotoUrl: null,
    locale: 'en',
    helpfulCount: 0,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    ...overrides,
  };
}

export function newReview(toolId: string, authorUid: string, rating: number): DocumentData {
  return {
    toolId,
    authorUid,
    rating,
    body: 'Sharp output, slow queue.',
    authorName: `User ${authorUid}`,
    authorPhotoUrl: 'https://example.com/avatar.png',
    locale: 'en',
    helpfulCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function profileDoc(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    displayName: 'Alice',
    photoUrl: null,
    locale: 'en',
    prefs: { productUpdates: true, emailDigest: false },
    notificationsSeenAt: null,
    createdAt: SEEDED_AT,
    ...overrides,
  };
}

export function newProfile(): DocumentData {
  return {
    displayName: 'Alice',
    photoUrl: null,
    locale: 'en',
    prefs: { productUpdates: true, emailDigest: false },
    notificationsSeenAt: null,
    createdAt: serverTimestamp(),
  };
}

export function collectionDoc(overrides: Partial<UserCollection> = {}): UserCollection {
  return {
    name: 'Design',
    icon: COLLECTION_ICONS[0],
    color: ACCENTS[0],
    toolIds: ['midjourney'],
    order: 0,
    createdAt: SEEDED_AT,
    ...overrides,
  };
}

export function newCollection(): DocumentData {
  return {
    name: 'Design',
    icon: COLLECTION_ICONS[0],
    color: ACCENTS[0],
    toolIds: ['midjourney'],
    order: 0,
    createdAt: serverTimestamp(),
  };
}

export function newBundleInterest(period: BundlePeriod = 'monthly'): DocumentData {
  return { period, createdAt: serverTimestamp() };
}

export function bundleInterestDoc(period: BundlePeriod = 'monthly') {
  return { period, createdAt: SEEDED_AT };
}

export function subscriptionDoc(bundleId: string): Subscription {
  return { bundleId, period: 'monthly', status: 'active', currentPeriodEnd: SEEDED_AT };
}

export function without(data: DocumentData, key: string): DocumentData {
  return Object.fromEntries(Object.entries(data).filter(([name]) => name !== key));
}
