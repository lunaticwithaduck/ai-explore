import type { BundlePeriodSummary, Locale } from '@ai-explore/schemas';
import { Badge, Card, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { formatCents } from '@/lib/format/money';

type BundlePriceProps = {
  summary: BundlePeriodSummary;
  children?: ReactNode;
};

export function BundlePrice({ summary, children }: BundlePriceProps) {
  const t = useTranslations('bundles');
  const locale = useLocale() as Locale;
  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Text as="span" size="lg" weight="semibold" numeric data-testid={TEST_IDS.bundles.price}>
          {formatCents(summary.priceCents, locale)}
        </Text>
        <Text as="span" size="sm" tone="muted">
          {t(`price.suffix.${summary.period}`)}
        </Text>
        <Text
          as="span"
          size="sm"
          tone="subtle"
          numeric
          className="line-through"
          data-testid={TEST_IDS.bundles.listPrice}
        >
          {formatCents(summary.listPriceCents, locale)}
        </Text>
        <Badge tone="success" data-testid={TEST_IDS.bundles.savings}>
          {t('price.save', { percent: summary.savingsPercent })}
        </Badge>
      </div>
      {summary.period !== 'monthly' && (
        <Text size="sm" tone="muted" numeric>
          {t('price.perMonth', { price: formatCents(summary.perMonthCents, locale) })}
        </Text>
      )}
      {children}
    </Card>
  );
}
