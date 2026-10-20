'use client';

import type { RatingAggregate } from '@ai-explore/schemas';
import { StarRating, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useToolRatingQuery } from '@/api/endpoints/reviews';
import { useAppLocale } from '@/features/auth/hooks/useAppLocale';
import { averageRating, formatAverage } from '@/lib/format/rating';

export type ToolHeaderRatingProps = {
  toolId: string;
  initial: RatingAggregate;
};

export function ToolHeaderRating({ toolId, initial }: ToolHeaderRatingProps) {
  const t = useTranslations('tool.header');
  const locale = useAppLocale();
  const { currentData } = useToolRatingQuery(toolId);
  const rating = currentData === undefined ? initial : currentData;
  const average = rating ? averageRating(rating) : null;
  const averageText = average === null ? null : formatAverage(average, locale);
  return (
    <div className="mt-3 flex items-center gap-2">
      <StarRating
        value={average ?? 0}
        label={averageText === null ? t('noRating') : t('ratingLabel', { average: averageText })}
        valueText={averageText ?? undefined}
      />
      {averageText === null && (
        <Text as="span" size="sm" tone="subtle">
          {t('noRating')}
        </Text>
      )}
    </div>
  );
}
