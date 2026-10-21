'use client';

import { BUNDLE_PERIODS, type Locale, pickLocalized } from '@ai-explore/schemas';
import { Skeleton, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useAdminBundlesQuery, useAdminInterestQuery } from '@/api/endpoints/admin';
import { TEST_IDS } from '@/config/test-ids';
import { countInterest } from '../../utils/interestCounts';
import { AdminRow } from '../AdminRow/AdminRow';
import { adminRowStyles } from '../AdminRow/AdminRow.styles';
import { QueryNotice } from '../QueryNotice/QueryNotice';

export function InterestTab() {
  const t = useTranslations('admin');
  const locale = useLocale() as Locale;
  const interest = useAdminInterestQuery();
  const bundles = useAdminBundlesQuery();
  const rows = useMemo(
    () =>
      countInterest(
        interest.data ?? [],
        bundles.data?.map((bundle) => bundle.id),
      ),
    [interest.data, bundles.data],
  );
  const names = useMemo(
    () => new Map(bundles.data?.map((bundle) => [bundle.id, pickLocalized(bundle.name, locale)])),
    [bundles.data, locale],
  );
  return (
    <section className="flex flex-col gap-4">
      <Text tone="muted">{t('interest.hint')}</Text>
      <QueryNotice error={interest.error ?? bundles.error} />
      {interest.isLoading && <Skeleton shape="card" className="h-16" />}
      <div className={adminRowStyles.list}>
        {rows.map((row) => (
          <AdminRow key={row.bundleId} id={row.bundleId}>
            <div className={adminRowStyles.main}>
              <Text weight="medium">{names.get(row.bundleId) ?? row.bundleId}</Text>
              <Text size="xs" tone="muted">
                {row.bundleId}
              </Text>
            </div>
            <div className={adminRowStyles.side}>
              {BUNDLE_PERIODS.map((period) => (
                <Text key={period} size="xs" tone="muted" numeric>
                  {t('interest.period', {
                    period: t(`interest.periods.${period}`),
                    count: row.periods[period],
                  })}
                </Text>
              ))}
              <Text size="xs" tone="muted">
                {t('interest.total')}
              </Text>
              <Text
                weight="semibold"
                numeric
                data-testid={TEST_IDS.admin.interestCount}
                data-id={row.bundleId}
              >
                {row.total}
              </Text>
            </div>
          </AdminRow>
        ))}
      </div>
    </section>
  );
}
