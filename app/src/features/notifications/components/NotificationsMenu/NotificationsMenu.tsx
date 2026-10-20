'use client';

import { Badge, IconButton, Popover, PopoverTrigger } from '@ai-explore/ui';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationsPanel } from '../NotificationsPanel/NotificationsPanel';
import { menuStyles } from './NotificationsMenu.styles';

const BADGE_MAX = 99;

export type NotificationsMenuProps = { uid: string };

export function NotificationsMenu({ uid }: NotificationsMenuProps) {
  const t = useTranslations('notifications');
  const state = useNotifications(uid);
  return (
    <Popover>
      <div className={menuStyles.root}>
        <PopoverTrigger asChild>
          <IconButton
            icon={Bell}
            label={t('bell', { count: state.newCount })}
            data-testid={TEST_IDS.notifications.bell}
          />
        </PopoverTrigger>
        {state.newCount > 0 && (
          <Badge
            tone="solid"
            size="sm"
            className={menuStyles.badge}
            data-testid={TEST_IDS.notifications.badge}
            aria-hidden
          >
            {state.newCount > BADGE_MAX ? t('overflow', { max: BADGE_MAX }) : state.newCount}
          </Badge>
        )}
      </div>
      <NotificationsPanel
        items={state.items}
        newCount={state.newCount}
        isLoading={state.isLoading}
        isFailed={state.isFailed}
        isMarking={state.isMarking}
        onMarkAllRead={state.markAllRead}
      />
    </Popover>
  );
}
