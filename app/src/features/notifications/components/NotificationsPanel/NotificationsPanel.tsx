'use client';

import { Button, Heading, PopoverContent, Skeleton, Text } from '@ai-explore/ui';
import { BellOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import type { NotificationEntry } from '../../hooks/useNotifications';
import { NotificationItem } from '../NotificationItem/NotificationItem';
import { panelStyles } from './NotificationsPanel.styles';

export type NotificationsPanelProps = {
  items: NotificationEntry[];
  newCount: number;
  isLoading: boolean;
  isFailed: boolean;
  isMarking: boolean;
  onMarkAllRead: () => void;
};

export function NotificationsPanel({
  items,
  newCount,
  isLoading,
  isFailed,
  isMarking,
  onMarkAllRead,
}: NotificationsPanelProps) {
  const t = useTranslations('notifications');
  const tErrors = useTranslations('errors');
  return (
    <PopoverContent
      size="lg"
      align="end"
      className={panelStyles.content}
      data-testid={TEST_IDS.notifications.panel}
    >
      <div className={panelStyles.header}>
        <div>
          <Heading level={2} size="sm">
            {t('title')}
          </Heading>
          {newCount > 0 && (
            <Text size="xs" tone="muted">
              {t('newCount', { count: newCount })}
            </Text>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={newCount === 0 || isMarking}
          onClick={onMarkAllRead}
          data-testid={TEST_IDS.notifications.markAllRead}
        >
          {t('markAllRead')}
        </Button>
      </div>
      {isFailed ? (
        <Text tone="danger" size="sm" className={panelStyles.status}>
          {tErrors('unknown')}
        </Text>
      ) : isLoading ? (
        <div className={panelStyles.status}>
          <Skeleton shape="text" className="h-12 w-full" />
        </div>
      ) : items.length === 0 ? (
        <div className={panelStyles.empty}>
          <BellOff aria-hidden className={panelStyles.emptyIcon} />
          <Text size="sm" weight="medium">
            {t('emptyTitle')}
          </Text>
          <Text size="xs" tone="muted">
            {t('emptyBody')}
          </Text>
        </div>
      ) : (
        <ul className={panelStyles.list}>
          {items.map((entry) => (
            <NotificationItem key={entry.update.id} entry={entry} />
          ))}
        </ul>
      )}
    </PopoverContent>
  );
}
