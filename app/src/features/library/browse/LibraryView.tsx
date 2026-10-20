'use client';

import type { Bundle, Category, Tool, WithId } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { BundlesSection } from '@/features/bundles/components/BundlesSection/BundlesSection';
import { LibraryEmpty } from '../components/LibraryEmpty/LibraryEmpty';
import { LibraryFilters } from '../components/LibraryFilters/LibraryFilters';
import { LibraryGrid } from '../components/LibraryGrid/LibraryGrid';
import { useLibraryFilters } from '../hooks/useLibraryFilters';
import { filterTools } from '../utils/libraryFilters';
import { sortTools } from '../utils/sortTools';

export type LibraryViewProps = {
  tools: WithId<Tool>[];
  categories: WithId<Category>[];
  bundles: WithId<Bundle>[];
};

export function LibraryView({ tools, categories, bundles }: LibraryViewProps) {
  const t = useTranslations('common');
  const tLibrary = useTranslations('library');
  const { filters, reset } = useLibraryFilters();
  const visible = sortTools(filterTools(tools, filters), filters.sort);
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-1">
        <Heading level={1}>{t('appName')}</Heading>
        <Text tone="muted">{t('tagline')}</Text>
      </header>
      <LibraryFilters tools={tools} categories={categories} />
      {visible.length === 0 ? (
        <LibraryEmpty onReset={reset} />
      ) : (
        <>
          <Heading level={2} className="sr-only">
            {tLibrary('resultsTitle')}
          </Heading>
          <LibraryGrid tools={visible} categories={categories} />
        </>
      )}
      <BundlesSection bundles={bundles} tools={tools} />
    </main>
  );
}
