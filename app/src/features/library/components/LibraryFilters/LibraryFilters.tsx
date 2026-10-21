'use client';

import type { Category, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Button, SearchInput, Text } from '@ai-explore/ui';
import { SlidersHorizontal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { useLibraryFilters } from '../../hooks/useLibraryFilters';
import { panelFilterCount } from '../../utils/libraryFilters';
import { FilterChips } from '../FilterChips/FilterChips';
import { LibraryFilterPanel } from '../LibraryFilterPanel/LibraryFilterPanel';
import { libraryFiltersStyles as styles } from './LibraryFilters.styles';

export type LibraryFiltersProps = {
  tools: WithId<Tool>[];
  categories: WithId<Category>[];
};

const ALL_CATEGORIES = '';
const PANEL_ID = 'library-filter-panel';

export function LibraryFilters({ tools, categories }: LibraryFiltersProps) {
  const t = useTranslations('library');
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  const { filters, update } = useLibraryFilters();
  const [text, setText] = useState(filters.q);
  const [open, setOpen] = useState(false);
  const panelCount = panelFilterCount(filters);

  useEffect(() => setText(filters.q), [filters.q]);

  const categoryChips = [
    { id: ALL_CATEGORIES, label: t('allCategories') },
    ...categories.map((c) => ({ id: c.id, label: pickLocalized(c.name, locale) })),
  ];

  return (
    <div className={styles.root}>
      <div className={styles.searchRow}>
        <SearchInput
          size="lg"
          data-testid={TEST_IDS.library.searchInput}
          aria-label={t('searchLabel')}
          placeholder={t('searchPlaceholder')}
          value={text}
          clearLabel={t('clearSearch')}
          onChange={(event) => {
            setText(event.target.value);
            update({ q: event.target.value });
          }}
          onClear={() => {
            setText('');
            update({ q: '' });
          }}
          wrapperClassName="flex-1"
        />
        <Button
          variant={open || panelCount > 0 ? 'primary' : 'secondary'}
          size="lg"
          iconLeft={SlidersHorizontal}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          onClick={() => setOpen((value) => !value)}
          className={styles.toggle}
        >
          <Text as="span" size="md" tone="inherit" className={styles.toggleLabel}>
            {t('filters.toggle')}
          </Text>
          {panelCount > 0 && (
            <Text as="span" size="xs" tone="inherit" className={styles.count}>
              {panelCount}
            </Text>
          )}
        </Button>
      </div>
      <FilterChips
        chips={categoryChips}
        label={t('categoryLabel')}
        testId={TEST_IDS.library.categoryFilter}
        className={styles.categories}
        isPressed={(id) => filters.category === id}
        onToggle={(id) => update({ category: filters.category === id ? ALL_CATEGORIES : id })}
      />
      {open && <LibraryFilterPanel id={PANEL_ID} tools={tools} />}
    </div>
  );
}
