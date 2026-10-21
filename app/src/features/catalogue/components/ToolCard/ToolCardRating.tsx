import type { Locale, Tool } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { averageRating, formatAverage } from '@/lib/format/rating';

export type ToolCardRatingProps = {
  rating: Tool['rating'];
  locale: Locale;
};

export function ToolCardRating({ rating, locale }: ToolCardRatingProps) {
  const t = useTranslations('library');
  const average = averageRating(rating);
  return (
    <div
      data-testid={TEST_IDS.library.cardRating}
      className="flex shrink-0 items-center gap-1 whitespace-nowrap"
    >
      {average === null ? (
        <Text size="xs" tone="subtle">
          {t('card.noReviews')}
        </Text>
      ) : (
        <>
          <Star aria-hidden className="size-3.5 fill-star text-star" />
          <Text size="sm" weight="medium" numeric>
            {formatAverage(average, locale)}
          </Text>
          <Text size="xs" tone="subtle" numeric>
            {t('card.reviewCount', { count: rating.count })}
          </Text>
        </>
      )}
    </div>
  );
}
