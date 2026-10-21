import type { Locale, Tool } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { averageRating, formatAverage } from '@/lib/format/rating';
import { toolCardStyles } from './ToolCard.styles';

export type ToolCardRatingProps = {
  rating: Tool['rating'];
  locale: Locale;
};

export function ToolCardRating({ rating, locale }: ToolCardRatingProps) {
  const t = useTranslations('library');
  const average = averageRating(rating);
  if (average === null) return null;
  return (
    <div data-testid={TEST_IDS.library.cardRating} className={toolCardStyles.rating}>
      <Star aria-hidden className={toolCardStyles.ratingStar} />
      <Text as="span" size="sm" tone="inherit" numeric>
        <Text as="span" className="sr-only">
          {t('card.ratingLabel')}
        </Text>
        {formatAverage(average, locale)}
      </Text>
    </div>
  );
}
