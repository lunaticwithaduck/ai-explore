'use client';

import type { Bundle, Category, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { BundlesSection } from '@/features/bundles/components/BundlesSection/BundlesSection';
import { LibraryEmpty } from '../components/LibraryEmpty/LibraryEmpty';
import { LibraryFilters } from '../components/LibraryFilters/LibraryFilters';
import { LibraryGrid } from '../components/LibraryGrid/LibraryGrid';
import { useLibraryFilters } from '../hooks/useLibraryFilters';
import { filterTools, hasActiveFilters } from '../utils/libraryFilters';
import { sortTools } from '../utils/sortTools';

export type LibraryViewProps = {
  tools: WithId<Tool>[];
  categories: WithId<Category>[];
  bundles: WithId<Bundle>[];
};

const RESULTS_TITLE_ID = 'library-results-title';

export function LibraryView({ tools, categories, bundles }: LibraryViewProps) {
  const t = useTranslations('common');
  const tLibrary = useTranslations('library');
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  const { filters, reset } = useLibraryFilters();
  const visible = sortTools(filterTools(tools, filters), filters.sort);
  const filtered = hasActiveFilters(filters);
  const category = categories.find((item) => item.id === filters.category);
  const title = category
    ? pickLocalized(category.name, locale)
    : tLibrary(filtered ? 'resultsTitle' : 'allTools');
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-2">
        <Heading level={1}>{t('appName')}</Heading>
        <Text tone="muted">{t('tagline')}</Text>
      </header>
      <LibraryFilters tools={tools} categories={categories} />
      {!filtered && <BundlesSection bundles={bundles} tools={tools} />}
      <section aria-labelledby={RESULTS_TITLE_ID} className="flex flex-col gap-6">
        <Heading level={2} id={RESULTS_TITLE_ID}>
          {title}
        </Heading>
        {visible.length === 0 ? (
          <LibraryEmpty onReset={filtered ? reset : undefined} />
        ) : (
          <LibraryGrid tools={visible} />
        )}
      </section>
    </main>
  );
}
