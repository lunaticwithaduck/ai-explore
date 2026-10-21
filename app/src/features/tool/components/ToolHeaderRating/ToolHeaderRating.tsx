'use client';

import type { RatingAggregate } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLiveRating } from '../../hooks/useLiveRating';

export type ToolHeaderRatingProps = {
  toolId: string;
  initial: RatingAggregate;
};

export function ToolHeaderRating({ toolId, initial }: ToolHeaderRatingProps) {
  const t = useTranslations('tool.header');
  const { averageText, count } = useLiveRating(toolId, initial);
  if (averageText === null)
    return (
      <Text as="span" size="sm" tone="subtle">
        {t('noReviews')}
      </Text>
    );
  return (
    <div className="flex items-center gap-2 sm:justify-end">
      <span
        role="img"
        aria-label={t('ratingLabel', { average: averageText })}
        className="flex items-center gap-2"
      >
        <Star aria-hidden className="size-5 fill-star text-star" />
        <Text as="span" size="lg" numeric>
          {averageText}
        </Text>
      </span>
      <Text as="span" tone="muted" numeric>
        ({count})
      </Text>
    </div>
  );
}
