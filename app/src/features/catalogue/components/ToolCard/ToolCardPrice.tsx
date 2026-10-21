import type { Locale, Tool } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { formatCents } from '@/lib/format/money';

export type ToolCardPriceProps = {
  pricing: Tool['pricing'];
  locale: Locale;
};

export function ToolCardPrice({ pricing, locale }: ToolCardPriceProps) {
  const t = useTranslations('library');
  const label =
    pricing.fromPriceCents !== undefined
      ? t('card.price', { price: formatCents(pricing.fromPriceCents, locale) })
      : pricing.hasFreePlan
        ? t('card.free')
        : t('card.paid');
  return (
    <div className="flex h-6 min-w-min flex-wrap items-baseline gap-x-2 overflow-hidden whitespace-nowrap">
      <Text as="span" weight="medium" numeric>
        {label}
      </Text>
      {pricing.trialDays !== undefined && (
        <Text as="span" size="xs" tone="muted">
          {t('card.trial', { days: pricing.trialDays })}
        </Text>
      )}
    </div>
  );
}
