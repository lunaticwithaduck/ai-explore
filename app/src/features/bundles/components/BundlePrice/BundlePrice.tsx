import type { BundlePeriodSummary, Locale } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { formatCents } from '@/lib/format/money';
import { bundlePriceStyles } from './BundlePrice.styles';

type BundlePriceProps = {
  summary: BundlePeriodSummary;
};

export function BundlePrice({ summary }: BundlePriceProps) {
  const t = useTranslations('bundles');
  const locale = useLocale() as Locale;
  return (
    <div className={bundlePriceStyles.root}>
      <div className={bundlePriceStyles.amounts}>
        <Text
          as="span"
          numeric
          className={bundlePriceStyles.price}
          data-testid={TEST_IDS.bundles.price}
        >
          {formatCents(summary.priceCents, locale)}
        </Text>
        <Text
          as="span"
          tone="muted"
          numeric
          className={bundlePriceStyles.list}
          data-testid={TEST_IDS.bundles.listPrice}
        >
          {formatCents(summary.listPriceCents, locale)}
        </Text>
      </div>
      {summary.period !== 'monthly' && (
        <Text size="sm" tone="muted" numeric>
          {t('price.perMonth', { price: formatCents(summary.perMonthCents, locale) })}
        </Text>
      )}
      <Text
        as="span"
        size="sm"
        className={bundlePriceStyles.savings}
        data-testid={TEST_IDS.bundles.savings}
      >
        {t('price.save', { percent: summary.savingsPercent })}
      </Text>
    </div>
  );
}
