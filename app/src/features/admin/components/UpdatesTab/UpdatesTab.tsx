'use client';

import { Badge, Button, Skeleton, Text } from '@ai-explore/ui';
import { Pencil, Plus } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useAdminToolsQuery, useAdminUpdatesQuery } from '@/api/endpoints/admin';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { formatVersion } from '@/lib/format/version';
import { adminUpdateHref } from '../../utils/updateDocument';
import { AdminRow } from '../AdminRow/AdminRow';
import { adminRowStyles } from '../AdminRow/AdminRow.styles';
import { QueryNotice } from '../QueryNotice/QueryNotice';

export function UpdatesTab() {
  const t = useTranslations('admin');
  const format = useFormatter();
  const updates = useAdminUpdatesQuery();
  const tools = useAdminToolsQuery();
  const toolNames = new Map(tools.data?.map((tool) => [tool.id, tool.name]));
  return (
    <section className="flex flex-col gap-4">
      <div className={adminRowStyles.toolbar}>
        <Text tone="muted">{t('updates.count', { count: updates.data?.length ?? 0 })}</Text>
        <Button asChild size="sm" iconLeft={Plus}>
          <Link href={routes.adminNewUpdate}>{t('updates.new')}</Link>
        </Button>
      </div>
      <QueryNotice error={updates.error} />
      {updates.isLoading && <Skeleton shape="card" className="h-16" />}
      <div className={adminRowStyles.list}>
        {updates.data?.map(({ toolId, updateId, update }) => (
          <AdminRow key={`${toolId}/${updateId}`} id={`${toolId}/${updateId}`}>
            <div className={adminRowStyles.main}>
              <Text weight="medium">
                {toolNames.get(toolId) ?? toolId} {formatVersion(update.version)}
              </Text>
              <Text size="xs" tone="muted">
                {format.dateTime(update.publishedAt, { dateStyle: 'medium' })}
              </Text>
            </div>
            <div className={adminRowStyles.side}>
              <Badge tone="neutral">{t(`update.kinds.${update.kind}`)}</Badge>
              <Button asChild size="sm" variant="secondary" iconLeft={Pencil}>
                <Link href={adminUpdateHref(toolId, updateId)}>{t('actions.edit')}</Link>
              </Button>
            </div>
          </AdminRow>
        ))}
      </div>
    </section>
  );
}
