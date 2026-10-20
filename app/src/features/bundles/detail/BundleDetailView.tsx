'use client';

import type { Bundle, BundlePeriod, Tool, WithId } from '@ai-explore/schemas';
import { BUNDLE_PERIODS } from '@ai-explore/schemas';
import { Heading, SegmentedControl } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { ToolCard } from '@/features/catalogue/components/ToolCard/ToolCard';
import { BundleCta } from '../components/BundleCta/BundleCta';
import { BundleHeader } from '../components/BundleHeader/BundleHeader';
import { BundlePrice } from '../components/BundlePrice/BundlePrice';
import { includedTools, summarizeBundle } from '../utils/bundleSummary';

export type BundleDetailViewProps = {
  bundle: WithId<Bundle>;
  tools: WithId<Tool>[];
};

export function BundleDetailView({ bundle, tools }: BundleDetailViewProps) {
  const t = useTranslations('bundles');
  const [period, setPeriod] = useState<BundlePeriod>('monthly');
  const included = includedTools(bundle, tools);
  const summary = summarizeBundle(bundle, included, period);
  const options = BUNDLE_PERIODS.map((value) => ({
    value,
    label: t(`period.${value}`),
    testId: TEST_IDS.bundles.periodOption,
  }));
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-8 sm:px-6">
      <BundleHeader bundle={bundle} />
      <section className="flex max-w-xl flex-col gap-4">
        <SegmentedControl
          options={options}
          value={period}
          onValueChange={(value) => setPeriod(value as BundlePeriod)}
          label={t('period.label')}
          fullWidth
        />
        <BundlePrice summary={summary}>
          <BundleCta bundleId={bundle.id} period={period} />
        </BundlePrice>
      </section>
      <section className="flex flex-col gap-4" aria-labelledby="bundle-included-title">
        <Heading level={2} id="bundle-included-title">
          {t('detail.included', { count: included.length })}
        </Heading>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {included.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
}
