export const SORT_KEYS = ['rating', 'reviews', 'priceAsc', 'priceDesc', 'newest'] as const;
export type SortKey = (typeof SORT_KEYS)[number];
export const DEFAULT_SORT: SortKey = 'rating';

export const SORT_URL_VALUES: Record<SortKey, string> = {
  rating: 'rating',
  reviews: 'reviews',
  priceAsc: 'price-asc',
  priceDesc: 'price-desc',
  newest: 'newest',
};

export const PRICE_KEYS = ['all', 'free', 'trial', 'paid'] as const;
export type PriceKey = (typeof PRICE_KEYS)[number];
export const DEFAULT_PRICE: PriceKey = 'all';

export const MAX_TAG_CHIPS = 14;
