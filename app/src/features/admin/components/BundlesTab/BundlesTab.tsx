'use client';

import { type Locale, pickLocalized } from '@ai-explore/schemas';
import { Badge, Button, Skeleton, Text } from '@ai-explore/ui';
import { Pencil, Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAdminBundlesQuery } from '@/api/endpoints/admin';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { AdminRow } from '../AdminRow/AdminRow';
import { adminRowStyles } from '../AdminRow/AdminRow.styles';
import { QueryNotice } from '../QueryNotice/QueryNotice';

export function BundlesTab() {
  const t = useTranslations('admin');
  const locale = useLocale() as Locale;
  const { data, isLoading, error } = useAdminBundlesQuery();
  return (
    <section className="flex flex-col gap-4">
      <div className={adminRowStyles.toolbar}>
        <Text tone="muted">{t('bundles.count', { count: data?.length ?? 0 })}</Text>
        <Button asChild size="sm" iconLeft={Plus}>
          <Link href={routes.adminNewBundle}>{t('bundles.new')}</Link>
        </Button>
      </div>
      <QueryNotice error={error} />
      {isLoading && <Skeleton shape="card" className="h-16" />}
      <div className={adminRowStyles.list}>
        {data?.map((bundle) => (
          <AdminRow key={bundle.id} id={bundle.id}>
            <div className={adminRowStyles.main}>
              <Text weight="medium">{pickLocalized(bundle.name, locale)}</Text>
              <Text size="xs" tone="subtle">
                {bundle.id}
              </Text>
            </div>
            <div className={adminRowStyles.side}>
              <Badge tone={bundle.published ? 'success' : 'neutral'}>
                {bundle.published ? t('status.published') : t('status.draft')}
              </Badge>
              <Button asChild size="sm" variant="secondary" iconLeft={Pencil}>
                <Link href={routes.adminBundle(bundle.id)}>{t('actions.edit')}</Link>
              </Button>
            </div>
          </AdminRow>
        ))}
      </div>
    </section>
  );
}
