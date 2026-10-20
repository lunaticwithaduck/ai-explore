import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { EmptyState } from '@/features/system/components/EmptyState/EmptyState';
import { BundleCard } from '../components/BundleCard/BundleCard';

export type BundleListViewProps = {
  bundles: WithId<Bundle>[];
  tools: WithId<Tool>[];
};

export function BundleListView({ bundles, tools }: BundleListViewProps) {
  const t = useTranslations('bundles');
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <Heading level={1}>{t('list.title')}</Heading>
        <Text tone="muted" className="max-w-prose">
          {t('list.intro')}
        </Text>
      </header>
      {bundles.length === 0 ? (
        <EmptyState title={t('list.emptyTitle')} body={t('list.emptyBody')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} tools={tools} />
          ))}
        </div>
      )}
    </main>
  );
}
