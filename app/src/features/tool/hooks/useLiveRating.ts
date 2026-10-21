import type { RatingAggregate } from '@ai-explore/schemas';
import { useToolRatingQuery } from '@/api/endpoints/reviews';
import { useAppLocale } from '@/features/auth/hooks/useAppLocale';
import { averageRating, formatAverage } from '@/lib/format/rating';

export type LiveRating = {
  average: number | null;
  averageText: string | null;
  count: number;
};

export function useLiveRating(toolId: string, initial: RatingAggregate): LiveRating {
  const locale = useAppLocale();
  const { currentData } = useToolRatingQuery(toolId);
  const rating = currentData === undefined ? initial : currentData;
  const average = rating ? averageRating(rating) : null;
  return {
    average,
    averageText: average === null ? null : formatAverage(average, locale),
    count: rating?.count ?? 0,
  };
}
