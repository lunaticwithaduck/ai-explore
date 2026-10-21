'use client';

import type { BundlePeriod, BundlePeriodSummary, Tool, WithId } from '@ai-explore/schemas';
import { BUNDLE_PERIODS } from '@ai-explore/schemas';
import { Card, SegmentedControl, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { BundleChecklist } from '../BundleChecklist/BundleChecklist';
import { BundleCta } from '../BundleCta/BundleCta';
import { BundlePrice } from '../BundlePrice/BundlePrice';
import { bundlePricingCardStyles } from './BundlePricingCard.styles';

type BundlePricingCardProps = {
  bundleId: string;
  summary: BundlePeriodSummary;
  savingsByPeriod: Record<BundlePeriod, number>;
  tools: WithId<Tool>[];
  onPeriodChange: (period: BundlePeriod) => void;
};

export function BundlePricingCard({
  bundleId,
  summary,
  savingsByPeriod,
  tools,
  onPeriodChange,
}: BundlePricingCardProps) {
  const t = useTranslations('bundles');
  const options = BUNDLE_PERIODS.map((value) => ({
    value,
    label: t(`period.${value}`),
    description:
      savingsByPeriod[value] > 0 ? t('card.save', { percent: savingsByPeriod[value] }) : undefined,
    testId: TEST_IDS.bundles.periodOption,
  }));
  return (
    <Card padding="none" className={bundlePricingCardStyles.card}>
      <SegmentedControl
        options={options}
        value={summary.period}
        onValueChange={(value) => onPeriodChange(value as BundlePeriod)}
        label={t('period.label')}
        fullWidth
      />
      <BundlePrice summary={summary} />
      <BundleChecklist tools={tools} />
      <BundleCta bundleId={bundleId} period={summary.period} />
      <Text size="xs" tone="muted" className={bundlePricingCardStyles.footnote}>
        {t(`detail.footnote.${summary.period}`, { count: tools.length })}
      </Text>
    </Card>
  );
}
