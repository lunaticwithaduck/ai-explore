'use client';

import type { Category, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { SearchInput, Select } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { PRICE_KEYS, type PriceKey, SORT_KEYS, type SortKey } from '../../config/constants';
import { useLibraryFilters } from '../../hooks/useLibraryFilters';
import { tagLabel, tagOptions } from '../../utils/tagOptions';
import { FilterChips } from '../FilterChips/FilterChips';

export type LibraryFiltersProps = {
  tools: WithId<Tool>[];
  categories: WithId<Category>[];
};

const ALL_CATEGORIES = '';

export function LibraryFilters({ tools, categories }: LibraryFiltersProps) {
  const t = useTranslations('library');
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  const { filters, update } = useLibraryFilters();
  const [text, setText] = useState(filters.q);

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
      <FilterChips
        chips={categoryChips}
        label={t('categoryLabel')}
        testId={TEST_IDS.library.categoryFilter}
        isPressed={(id) => filters.category === id}
        onToggle={(id) => update({ category: filters.category === id ? ALL_CATEGORIES : id })}
      />
      {tagChips.length > 0 && (
        <FilterChips
          chips={tagChips}
          label={t('tagLabel')}
          testId={TEST_IDS.library.tagFilter}
          isPressed={(id) => filters.tags.includes(id)}
          onToggle={(id) =>
            update({
              tags: filters.tags.includes(id)
                ? filters.tags.filter((tag) => tag !== id)
                : [...filters.tags, id],
            })
          }
        />
      )}
    </div>
  );
}
