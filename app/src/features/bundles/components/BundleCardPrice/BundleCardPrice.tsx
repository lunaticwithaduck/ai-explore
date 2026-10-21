import type { BundlePeriodSummary, Locale } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { formatCents } from '@/lib/format/money';
import { bundleCardPriceStyles } from './BundleCardPrice.styles';

type BundleCardPriceProps = {
  summary: BundlePeriodSummary;
};

export function BundleCardPrice({ summary }: BundleCardPriceProps) {
  const t = useTranslations('bundles');
  const locale = useLocale() as Locale;
  const discounted = summary.savingsPercent > 0;
  return (
    <div className={bundleCardPriceStyles.root}>
      <div className={bundleCardPriceStyles.amounts}>
        <Text as="span" numeric className={bundleCardPriceStyles.price}>
          {formatCents(summary.priceCents, locale)}
        </Text>
        {discounted && (
          <Text as="span" size="sm" tone="muted" numeric className={bundleCardPriceStyles.list}>
            {formatCents(summary.listPriceCents, locale)}
          </Text>
        )}
      </div>
      {discounted && (
        <Text as="span" size="xs" className={bundleCardPriceStyles.save}>
          {t('card.save', { percent: summary.savingsPercent })}
        </Text>
      )}
      <Text as="span" size="xs" tone="muted" className={bundleCardPriceStyles.period}>
        {t('card.perMonth')}
      </Text>
    </div>
  );
}
