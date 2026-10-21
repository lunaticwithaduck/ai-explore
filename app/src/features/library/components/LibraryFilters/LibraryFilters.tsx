'use client';

import type { Category, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Button, cn, SearchInput, Select } from '@ai-explore/ui';
import { SlidersHorizontal, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { PRICE_KEYS, type PriceKey, SORT_KEYS, type SortKey } from '../../config/constants';
import { useLibraryFilters } from '../../hooks/useLibraryFilters';
import { activeFilterCount, panelFilterCount } from '../../utils/libraryFilters';
import { tagLabel, tagOptions } from '../../utils/tagOptions';
import { FilterChips } from '../FilterChips/FilterChips';

export type LibraryFiltersProps = {
  tools: WithId<Tool>[];
  categories: WithId<Category>[];
};

const ALL_CATEGORIES = '';
const TAGS_ID = 'library-tag-panel';
const PANEL_ID = 'library-filter-panel';

export function LibraryFilters({ tools, categories }: LibraryFiltersProps) {
  const t = useTranslations('library');
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  const { filters, update, reset } = useLibraryFilters();
  const [text, setText] = useState(filters.q);
  const [open, setOpen] = useState(false);
  const panelCount = panelFilterCount(filters);
  const clearCount = activeFilterCount(filters);

  useEffect(() => setText(filters.q), [filters.q]);

  const categoryChips = [
    { id: ALL_CATEGORIES, label: t('allCategories') },
    ...categories.map((c) => ({ id: c.id, label: pickLocalized(c.name, locale) })),
  ];
  const tagChips = tagOptions(tools, filters.tags).map((tag) => ({
    id: tag,
    label: tagLabel(tag),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
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
          wrapperClassName="sm:flex-1"
        />
        <Button
          variant="secondary"
          iconLeft={SlidersHorizontal}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          onClick={() => setOpen((value) => !value)}
          className="sm:hidden"
        >
          {panelCount > 0 ? t('filters.withCount', { count: panelCount }) : t('filters.toggle')}
        </Button>
        <div id={PANEL_ID} className={cn('flex-col gap-3 sm:contents', open ? 'flex' : 'hidden')}>
          <Select
            data-testid={TEST_IDS.library.priceFilter}
            aria-label={t('priceLabel')}
            value={filters.price}
            onValueChange={(value) => update({ price: value as PriceKey })}
            options={PRICE_KEYS.map((key) => ({ value: key, label: t(`price.${key}`) }))}
            className="sm:w-48"
          />
          <Select
            data-testid={TEST_IDS.library.sortSelect}
            aria-label={t('sortLabel')}
            value={filters.sort}
            onValueChange={(value) => update({ sort: value as SortKey })}
            options={SORT_KEYS.map((key) => ({ value: key, label: t(`sort.${key}`) }))}
            className="sm:w-56"
          />
        </div>
      </div>
      <FilterChips
        chips={categoryChips}
        label={t('categoryLabel')}
        testId={TEST_IDS.library.categoryFilter}
        className="-mx-4 flex-nowrap overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        isPressed={(id) => filters.category === id}
        onToggle={(id) => update({ category: filters.category === id ? ALL_CATEGORIES : id })}
      />
      {tagChips.length > 0 && (
        <div id={TAGS_ID} className={cn('sm:flex', open ? 'flex' : 'hidden')}>
          <FilterChips
            chips={tagChips}
            label={t('tagLabel')}
            testId={TEST_IDS.library.tagFilter}
            className="flex-wrap"
            isPressed={(id) => filters.tags.includes(id)}
            onToggle={(id) =>
              update({
                tags: filters.tags.includes(id)
                  ? filters.tags.filter((tag) => tag !== id)
                  : [...filters.tags, id],
              })
            }
          />
        </div>
      )}
      {clearCount > 0 && (
        <Button variant="ghost" size="sm" iconLeft={X} onClick={reset} className="self-start">
          {t('filters.clear', { count: clearCount })}
        </Button>
      )}
    </div>
  );
}
