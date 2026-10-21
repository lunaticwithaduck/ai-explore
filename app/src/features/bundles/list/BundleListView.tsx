import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { EmptyState } from '@/features/system/components/EmptyState/EmptyState';
import { BundleGrid } from '../components/BundleGrid/BundleGrid';

export type BundleListViewProps = {
  bundles: WithId<Bundle>[];
  tools: WithId<Tool>[];
};

export function BundleListView({ bundles, tools }: BundleListViewProps) {
  const t = useTranslations('bundles');
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-2">
        <Heading level={1}>{t('list.title')}</Heading>
        <Text tone="muted" className="max-w-prose">
          {t('list.intro')}
        </Text>
      </header>
      {bundles.length === 0 ? (
        <EmptyState title={t('list.emptyTitle')} body={t('list.emptyBody')} />
      ) : (
        <section>
          <Heading level={2} className="sr-only">
            {t('list.resultsTitle')}
          </Heading>
          <BundleGrid bundles={bundles} tools={tools} />
        </section>
      )}
    </main>
  );
}
