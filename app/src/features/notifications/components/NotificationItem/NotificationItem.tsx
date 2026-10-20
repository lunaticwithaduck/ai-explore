'use client';

import { type Locale, pickLocalized } from '@ai-explore/schemas';
import { Badge, PopoverClose, Text, TextLink, ToolLogo } from '@ai-explore/ui';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { formatVersion } from '@/lib/format/version';
import type { NotificationEntry } from '../../hooks/useNotifications';
import { itemStyles } from './NotificationItem.styles';

export type NotificationItemProps = {
  entry: NotificationEntry;
};

export function NotificationItem({ entry }: NotificationItemProps) {
  const t = useTranslations('notifications');
  const locale = useLocale() as Locale;
  const format = useFormatter();
  const { update, tool, isNew } = entry;
  return (
    <li data-testid={TEST_IDS.notifications.item} data-id={update.id} className={itemStyles.root}>
      <PopoverClose asChild>
        <TextLink
          asChild
          tone="inherit"
          underline="none"
          className={`${itemStyles.link} ${isNew ? itemStyles.unread : ''}`}
        >
          <Link href={routes.tool(tool.id)}>
            <ToolLogo
              src={tool.logo.path}
              alt={tool.name}
              background={tool.logo.background}
              size="sm"
            />
            <span className={itemStyles.body}>
              <span className={itemStyles.head}>
                <Text as="span" size="sm" weight="medium">
                  {tool.name}
                </Text>
                {isNew && (
                  <Badge tone="solid" size="sm" data-testid={TEST_IDS.notifications.newLabel}>
                    {t('newLabel')}
                  </Badge>
                )}
              </span>
              <span className={itemStyles.meta}>
                <Badge tone="outline" size="sm">
                  {formatVersion(update.version)}
                </Badge>
                <Text as="span" size="xs" tone="muted">
                  {format.relativeTime(update.publishedAt)}
                </Text>
              </span>
              <Text as="span" size="sm" tone="muted" clamp={2}>
                {pickLocalized(update.title, locale)}
              </Text>
            </span>
          </Link>
        </TextLink>
      </PopoverClose>
    </li>
  );
}
