'use client';

import type { RatingAggregate, ToolPricing } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { Star } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useLiveRating } from '../../hooks/useLiveRating';
import { ToolSection } from '../ToolSection/ToolSection';
import { ToolStat } from '../ToolStat/ToolStat';

export type ToolStatsProps = {
  toolId: string;
  rating: RatingAggregate;
  categoryName: string | null;
  pricing: ToolPricing;
};

export function ToolStats({ toolId, rating, categoryName, pricing }: ToolStatsProps) {
  const t = useTranslations('tool');
  const format = useFormatter();
  const { averageText, count } = useLiveRating(toolId, rating);
  const pricingNotes = [
    pricing.hasFreePlan && t('plans.freeBadge'),
    pricing.trialDays !== undefined && t('plans.trialBadge', { days: pricing.trialDays }),
  ].filter((note): note is string => Boolean(note));
  return (
    <ToolSection title={t('stats.title')} spacing="sm">
      <dl className="flex flex-col gap-4">
        <ToolStat label={t('stats.rating')}>
          {averageText === null ? (
            <Text tone="subtle">{t('header.noReviews')}</Text>
          ) : (
            <span className="flex items-center gap-2">
              <Text as="span" numeric className="text-2xl">
                {averageText}
              </Text>
              <Star aria-hidden className="size-5 fill-star text-star" />
            </span>
          )}
        </ToolStat>
        <ToolStat label={t('stats.reviews')}>
          <Text as="span" numeric className="text-2xl">
            {format.number(count)}
          </Text>
        </ToolStat>
        {categoryName && (
          <ToolStat label={t('stats.category')}>
            <Text as="span">{categoryName}</Text>
          </ToolStat>
        )}
        <ToolStat label={t('stats.pricing')}>
          {(pricingNotes.length > 0 ? pricingNotes : [t('stats.paidOnly')]).map((note) => (
            <Text key={note}>{note}</Text>
          ))}
        </ToolStat>
      </dl>
    </ToolSection>
  );
}
