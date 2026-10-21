'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { Button, Card, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import {
  DEFAULT_SORT,
  PRICE_KEYS,
  type PriceKey,
  SORT_KEYS,
  type SortKey,
} from '../../config/constants';
import { SORT_ICONS } from '../../config/icons';
import { useLibraryFilters } from '../../hooks/useLibraryFilters';
import { activeFilterCount } from '../../utils/libraryFilters';
import { tagLabel, tagOptions } from '../../utils/tagOptions';
import { FilterChips } from '../FilterChips/FilterChips';
import { libraryFilterPanelStyles as styles } from './LibraryFilterPanel.styles';

export type LibraryFilterPanelProps = {
  id: string;
  tools: WithId<Tool>[];
};

export function LibraryFilterPanel({ id, tools }: LibraryFilterPanelProps) {
  const t = useTranslations('library');
  const { filters, update, reset } = useLibraryFilters();
  const clearable = activeFilterCount(filters) > 0 || filters.sort !== DEFAULT_SORT;
  const tagChips = tagOptions(tools, filters.tags).map((tag) => ({
    id: tag,
    label: tagLabel(tag),
  }));

  return (
    <Card id={id} padding="none" className={styles.panel}>
      <div className={styles.section}>
        <div className={styles.titleRow}>
          <Text aria-hidden size="sm" weight="medium">
            {t('sortLabel')}
          </Text>
          {clearable && (
            <Button variant="ghost" size="sm" onClick={reset} className={styles.clear}>
              {t('filters.clearAll')}
            </Button>
          )}
        </div>
        <FilterChips
          chips={SORT_KEYS.map((key) => ({
            id: key,
            label: t(`sort.${key}`),
            icon: SORT_ICONS[key],
          }))}
          label={t('sortLabel')}
          testId={TEST_IDS.library.sortSelect}
          className={styles.chips}
          chipClassName={styles.option}
          isPressed={(key) => filters.sort === key}
          onToggle={(key) => update({ sort: key as SortKey })}
        />
      </div>
      <div className={styles.section}>
        <Text aria-hidden size="sm" weight="medium">
          {t('priceLabel')}
        </Text>
        <FilterChips
          chips={PRICE_KEYS.map((key) => ({ id: key, label: t(`price.${key}`) }))}
          label={t('priceLabel')}
          testId={TEST_IDS.library.priceFilter}
          className={styles.chips}
          chipClassName={styles.option}
          isPressed={(key) => filters.price === key}
          onToggle={(key) => update({ price: key as PriceKey })}
        />
      </div>
      {tagChips.length > 0 && (
        <div className={styles.section}>
          <Text aria-hidden size="sm" weight="medium">
            {t('tagLabel')}
          </Text>
          <FilterChips
            chips={tagChips}
            label={t('tagLabel')}
            testId={TEST_IDS.library.tagFilter}
            className={styles.chips}
            isPressed={(tag) => filters.tags.includes(tag)}
            onToggle={(tag) =>
              update({
                tags: filters.tags.includes(tag)
                  ? filters.tags.filter((item) => item !== tag)
                  : [...filters.tags, tag],
              })
            }
          />
        </div>
      )}
    </Card>
  );
}
