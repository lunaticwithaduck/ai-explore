'use client';

import { RatingInput, StarRating, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SIZES, STAR_VALUES } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';

export function RatingsSection() {
  const t = useTranslations('dev');
  const [rating, setRating] = useState<number | null>(4);
  return (
    <DemoSection id="ratings" title={t('ratings.title')} description={t('ratings.description')}>
      <DemoRow label={t('ratings.display')} className="flex-col items-start gap-2">
        {STAR_VALUES.map((value) => (
          <StarRating
            key={value}
            value={value}
            label={t('ratings.starsLabel', { value })}
            valueText={t('ratings.value', { value })}
          />
        ))}
      </DemoRow>
      <DemoRow label={t('ratings.sizes')} className="gap-5">
        {SIZES.map((size) => (
          <StarRating
            key={size}
            value={3.5}
            size={size}
            label={t('ratings.starsLabel', { value: 3.5 })}
          />
        ))}
      </DemoRow>
      <DemoRow label={t('ratings.input')} className="gap-4">
        <RatingInput
          value={rating}
          onChange={setRating}
          label={t('ratings.inputLabel')}
          getOptionLabel={(value) => t('ratings.option', { value })}
          size="lg"
        />
        <Text size="sm" tone="muted" numeric>
          {rating ? t('ratings.selected', { value: rating }) : t('ratings.none')}
        </Text>
      </DemoRow>
    </DemoSection>
  );
}
