import type { Tool, WithId } from '@ai-explore/schemas';
import type { SortKey } from '../config/constants';

export function sortPrice(tool: Tool): number {
  if (tool.pricing.hasFreePlan) return 0;
  return tool.pricing.fromPriceCents ?? 0;
}

function average(tool: Tool): number {
  return tool.rating.count > 0 ? tool.rating.sum / tool.rating.count : 0;
}

const COMPARATORS: Record<SortKey, (a: Tool, b: Tool) => number> = {
  rating: (a, b) => average(b) - average(a) || b.rating.count - a.rating.count,
  reviews: (a, b) => b.rating.count - a.rating.count || average(b) - average(a),
  priceAsc: (a, b) => sortPrice(a) - sortPrice(b),
  priceDesc: (a, b) => sortPrice(b) - sortPrice(a),
  newest: (a, b) => b.lastReleaseAt.getTime() - a.lastReleaseAt.getTime(),
};

export function sortTools<T extends WithId<Tool>>(tools: readonly T[], sort: SortKey): T[] {
  const compare = COMPARATORS[sort];
  return [...tools].sort((a, b) => compare(a, b) || a.name.localeCompare(b.name));
}
