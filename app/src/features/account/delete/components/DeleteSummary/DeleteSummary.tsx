'use client';

import { Text } from '@ai-explore/ui';
import { Library, type LucideIcon, MessageSquareText, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DELETED_ITEMS } from '../../config/constants';
import { deleteSummaryStyles as styles } from './DeleteSummary.styles';

const ITEM_ICONS: Record<(typeof DELETED_ITEMS)[number], LucideIcon> = {
  reviews: MessageSquareText,
  library: Library,
  profile: UserRound,
};

export function DeleteSummary() {
  const t = useTranslations('account');
  return (
    <div className={styles.root}>
      <Text size="sm" weight="medium">
        {t('delete.dialog.willRemove')}
      </Text>
      <ul className={styles.list}>
        {DELETED_ITEMS.map((item) => {
          const Icon = ITEM_ICONS[item];
          return (
            <li key={item} className={styles.item}>
              <Icon aria-hidden className={styles.icon} />
              <Text size="sm">{t(`delete.items.${item}`)}</Text>
            </li>
          );
        })}
      </ul>
      <Text size="xs" tone="muted">
        {t('delete.dialog.keeps')}
      </Text>
    </div>
  );
}
