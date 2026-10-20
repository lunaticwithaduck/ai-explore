'use client';

import { Skeleton, StarRating, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useToolRatingQuery } from '@/api/endpoints/reviews';
import { TEST_IDS } from '@/config/test-ids';
import { useAppLocale } from '@/features/auth/hooks/useAppLocale';
import { averageRating, formatAverage } from '@/lib/format/rating';
import { ratingSummaryStyles as styles } from './RatingSummary.styles';

export type RatingSummaryProps = {
  toolId: string;
};

export function RatingSummary({ toolId }: RatingSummaryProps) {
  const t = useTranslations('reviews.summary');
  const locale = useAppLocale();
  const { currentData: rating, isError } = useToolRatingQuery(toolId);

  if (rating === undefined) return isError ? null : <Skeleton className={styles.loading} />;
  const average = rating ? averageRating(rating) : null;
  if (!rating || average === null)
    return (
      <Text size="sm" tone="subtle">
        {t('empty')}
      </Text>
    );

  const averageText = formatAverage(average, locale);
  return (
    <div className={styles.root}>
      <Text
        as="span"
        numeric
        aria-hidden
        className={styles.average}
        data-testid={TEST_IDS.tool.ratingAverage}
      >
        {averageText}
      </Text>
      <div className={styles.details}>
        <StarRating value={average} label={t('label', { average: averageText })} />
        <Text as="span" size="xs" tone="muted" data-testid={TEST_IDS.tool.ratingCount}>
          {t('count', { count: rating.count })}
        </Text>
      </div>
    </div>
  );
}
