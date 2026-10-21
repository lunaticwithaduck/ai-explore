'use client';

import type { Bundle, BundlePeriod, Tool, WithId } from '@ai-explore/schemas';
import { BUNDLE_PERIODS } from '@ai-explore/schemas';
import { Heading } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ToolCard } from '@/features/catalogue/components/ToolCard/ToolCard';
import { EmptyState } from '@/features/system/components/EmptyState/EmptyState';
import { BundleBenefits } from '../components/BundleBenefits/BundleBenefits';
import { BundleHeader } from '../components/BundleHeader/BundleHeader';
import { BundlePricingCard } from '../components/BundlePricingCard/BundlePricingCard';
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
  const savingsByPeriod = Object.fromEntries(
    BUNDLE_PERIODS.map((value) => [value, summarizeBundle(bundle, included, value).savingsPercent]),
  ) as Record<BundlePeriod, number>;
  const bestSavings = Math.max(...Object.values(savingsByPeriod));
  return (
    <main className="flex w-full flex-col pb-8">
      <BundleHeader bundle={bundle} />
      <div className="mx-auto flex w-full max-w-content flex-col gap-12 px-4 pt-8 sm:px-8">
        <BundlePricingCard
          bundleId={bundle.id}
          summary={summary}
          savingsByPeriod={savingsByPeriod}
          tools={included}
          onPeriodChange={setPeriod}
        />
        <section className="flex flex-col gap-6" aria-labelledby="bundle-included-title">
          <Heading level={2} size="lg" id="bundle-included-title">
            {t('detail.included', { count: included.length })}
          </Heading>
          {included.length === 0 ? (
            <EmptyState title={t('detail.emptyTitle')} body={t('detail.emptyBody')} />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {included.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
        <BundleBenefits savingsPercent={bestSavings} />
      </div>
    </main>
  );
}
