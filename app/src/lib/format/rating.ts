import type { RatingAggregate } from '@ai-explore/schemas';

export function averageRating(rating: RatingAggregate): number | null {
  if (rating.count <= 0) return null;
  return Math.round((rating.sum / rating.count) * 10) / 10;
}

export function formatAverage(average: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(average);
}
