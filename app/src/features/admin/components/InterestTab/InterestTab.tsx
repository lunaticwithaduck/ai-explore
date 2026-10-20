'use client';

import { BUNDLE_PERIODS } from '@ai-explore/schemas';
import { Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useAdminBundlesQuery, useAdminInterestQuery } from '@/api/endpoints/admin';
import { TEST_IDS } from '@/config/test-ids';
import { countInterest } from '../../utils/interestCounts';
import { AdminRow } from '../AdminRow/AdminRow';
import { adminRowStyles } from '../AdminRow/AdminRow.styles';
import { QueryNotice } from '../QueryNotice/QueryNotice';

export function InterestTab() {
  const t = useTranslations('admin');
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
  return (
    <section className="flex flex-col gap-4">
      <Text tone="muted">{t('interest.hint')}</Text>
      <QueryNotice error={interest.error ?? bundles.error} />
      {interest.isLoading && <Skeleton shape="card" className="h-16" />}
      <div className={adminRowStyles.list}>
        {rows.map((row) => (
          <AdminRow key={row.bundleId} id={row.bundleId}>
            <Text weight="medium">{row.bundleId}</Text>
            <div className={adminRowStyles.side}>
              {BUNDLE_PERIODS.map((period) => (
                <Text key={period} size="xs" tone="subtle" numeric>
                  {t('interest.period', {
                    period: t(`interest.periods.${period}`),
                    count: row.periods[period],
                  })}
                </Text>
              ))}
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
