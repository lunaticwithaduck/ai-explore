'use client';

import { type Locale, localeSchema, type Tool, type WithId } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { routes } from '@/config/routes';
import { EmptyState } from '@/features/system/components/EmptyState/EmptyState';
import { useRouter } from '@/i18n/navigation';
import { ComparePicker } from '../components/ComparePicker/ComparePicker';
import { CompareTable } from '../components/CompareTable/CompareTable';
import { resolveCompare } from '../utils/resolveCompare';
import { compareViewStyles } from './CompareView.styles';

export type CompareViewProps = {
  tools: WithId<Tool>[];
  firstId: string | undefined;
  secondId: string | undefined;
};

export function CompareView({ tools, firstId, secondId }: CompareViewProps) {
  const t = useTranslations('compare');
  const router = useRouter();
  const parsed = localeSchema.safeParse(useLocale());
  const locale: Locale = parsed.success ? parsed.data : 'en';
  const { first, second } = useMemo(
    () => resolveCompare(tools, firstId, secondId),
    [tools, firstId, secondId],
  );
  const pending = tools.find((tool) => tool.id === secondId || tool.slug === secondId);

  return (
    <main className={compareViewStyles.page}>
      <header className={compareViewStyles.header}>
        <Heading level={1}>{t('title')}</Heading>
        <Text tone="muted">{t('subtitle')}</Text>
      </header>

      {tools.length < 2 ? (
        <EmptyState title={t('emptyTitle')} body={t('emptyBody')} />
      ) : first ? (
        <>
          <div className={compareViewStyles.pickers}>
            <Text size="sm" tone="muted">
              {t('pickSecondTitle', { name: first.name })}
            </Text>
            <ComparePicker
              tools={tools}
              selected={second}
              excludeId={first.id}
              label={t('pickSecond')}
              onSelect={(id) => router.replace(routes.compare(first.slug, id))}
            />
          </div>
          {second && <CompareTable first={first} second={second} locale={locale} />}
        </>
      ) : (
        <div className={compareViewStyles.pickers}>
          <Text size="sm" tone="muted">
            {t('pickFirstTitle')}
          </Text>
          <div className={compareViewStyles.pickerRow}>
            <ComparePicker
              tools={tools}
              selected={undefined}
              excludeId={pending?.id}
              label={t('pickFirst')}
              onSelect={(id) => router.replace(routes.compare(id, pending?.slug))}
            />
            <ComparePicker
              tools={tools}
              selected={pending}
              excludeId={undefined}
              label={t('pickSecond')}
              onSelect={(id) => router.replace(routes.compare(undefined, id))}
            />
          </div>
        </div>
      )}
    </main>
  );
}
