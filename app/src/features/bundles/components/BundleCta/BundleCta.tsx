'use client';

import type { BundlePeriod } from '@ai-explore/schemas';
import { Button } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { NotifyMeButton } from '@/features/bundle-interest/components/NotifyMeButton/NotifyMeButton';
import { useFlag } from '@/lib/feature-flags/FeatureFlagProvider';

type BundleCtaProps = {
  bundleId: string;
  period: BundlePeriod;
};

export function BundleCta({ bundleId, period }: BundleCtaProps) {
  const t = useTranslations('bundles');
  const checkoutEnabled = useFlag('checkoutEnabled');
  if (checkoutEnabled) {
    return (
      <Button size="lg" fullWidth data-testid={TEST_IDS.bundles.subscribe}>
        {t('detail.subscribe')}
      </Button>
    );
  }
  return <NotifyMeButton bundleId={bundleId} period={period} />;
}
