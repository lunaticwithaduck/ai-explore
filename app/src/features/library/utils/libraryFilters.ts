import type { Tool, WithId } from '@ai-explore/schemas';
import {
  DEFAULT_PRICE,
  DEFAULT_SORT,
  PRICE_KEYS,
  type PriceKey,
  SORT_KEYS,
  SORT_URL_VALUES,
  type SortKey,
} from '../config/constants';

export type LibraryFilters = {
  q: string;
  category: string;
  tags: string[];
  sort: SortKey;
  price: PriceKey;
};

export const EMPTY_FILTERS: LibraryFilters = {
  q: '',
  category: '',
  tags: [],
  sort: DEFAULT_SORT,
  price: DEFAULT_PRICE,
};

type ParamReader = { get: (name: string) => string | null };

export function parseFilters(params: ParamReader): LibraryFilters {
  const sortParam = params.get('sort');
  const priceParam = params.get('price');
  const tagsParam = params.get('tags') ?? '';
  return {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    tags: tagsParam.split(',').filter(Boolean),
    sort: SORT_KEYS.find((key) => SORT_URL_VALUES[key] === sortParam) ?? DEFAULT_SORT,
    price: PRICE_KEYS.find((key) => key === priceParam) ?? DEFAULT_PRICE,
  };
}

export function toQuery(filters: LibraryFilters) {
  return {
    q: filters.q.trim() || undefined,
    category: filters.category || undefined,
    tags: filters.tags,
    sort: filters.sort === DEFAULT_SORT ? undefined : SORT_URL_VALUES[filters.sort],
    price: filters.price === DEFAULT_PRICE ? undefined : filters.price,
  };
}

export function hasActiveFilters(filters: LibraryFilters): boolean {
  return (
    filters.q.trim() !== '' ||
    filters.category !== '' ||
    filters.tags.length > 0 ||
    filters.price !== DEFAULT_PRICE
  );
}

export function activeFilterCount(filters: LibraryFilters): number {
  return (
    (filters.q.trim() !== '' ? 1 : 0) +
    (filters.category !== '' ? 1 : 0) +
    filters.tags.length +
    (filters.price !== DEFAULT_PRICE ? 1 : 0)
  );
}

export function panelFilterCount(filters: LibraryFilters): number {
  return (
    filters.tags.length +
    (filters.price !== DEFAULT_PRICE ? 1 : 0) +
    (filters.sort !== DEFAULT_SORT ? 1 : 0)
  );
}

export function matchesQuery(tool: Tool, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    tool.name,
    tool.tagline.en,
    tool.tagline.bg ?? '',
    tool.developer,
    ...tool.tags,
  ];
  return haystack.some((value) => value.toLowerCase().includes(needle));
}

export function matchesPrice(tool: Tool, price: PriceKey): boolean {
  switch (price) {
    case 'free':
      return tool.pricing.hasFreePlan;
    case 'trial':
      return tool.pricing.trialDays !== undefined;
    case 'paid':
      return !tool.pricing.hasFreePlan;
    default:
      return true;
  }
}

export function filterTools<T extends WithId<Tool>>(tools: readonly T[], filters: LibraryFilters) {
  return tools.filter(
    (tool) =>
      matchesQuery(tool, filters.q) &&
      (!filters.category || tool.categoryId === filters.category) &&
      filters.tags.every((tag) => tool.tags.includes(tag)) &&
      matchesPrice(tool, filters.price),
  );
}
