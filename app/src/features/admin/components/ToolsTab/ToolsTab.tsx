'use client';

import { Badge, Button, Skeleton, Text } from '@ai-explore/ui';
import { Pencil, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAdminToolsQuery } from '@/api/endpoints/admin';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { AdminRow } from '../AdminRow/AdminRow';
import { adminRowStyles } from '../AdminRow/AdminRow.styles';
import { QueryNotice } from '../QueryNotice/QueryNotice';

export function ToolsTab() {
  const t = useTranslations('admin');
  const { data, isLoading, error } = useAdminToolsQuery();
  return (
    <section className="flex flex-col gap-4">
      <div className={adminRowStyles.toolbar}>
        <Text tone="muted">{t('tools.count', { count: data?.length ?? 0 })}</Text>
        <Button asChild size="sm" iconLeft={Plus}>
          <Link href={routes.adminNewTool} data-testid={TEST_IDS.admin.newTool}>
            {t('tools.new')}
          </Link>
        </Button>
      </div>
      <QueryNotice error={error} />
      {isLoading && <Skeleton shape="card" className="h-16" />}
      <div className={adminRowStyles.list}>
        {data?.map((tool) => (
          <AdminRow key={tool.id} id={tool.id} testId={TEST_IDS.admin.toolRow}>
            <div className={adminRowStyles.main}>
              <Text weight="medium">{tool.name}</Text>
              <Text size="xs" tone="subtle">
                {tool.id}
              </Text>
            </div>
            <div className={adminRowStyles.side}>
              <Badge tone={tool.published ? 'success' : 'neutral'}>
                {tool.published ? t('status.published') : t('status.draft')}
              </Badge>
              <Button asChild size="sm" variant="secondary" iconLeft={Pencil}>
                <Link href={routes.adminTool(tool.id)}>{t('actions.edit')}</Link>
              </Button>
            </div>
          </AdminRow>
        ))}
      </div>
    </section>
  );
}
