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
  const label = pricing.hasFreePlan
    ? t('card.free')
    : pricing.fromPriceCents !== undefined
      ? t('card.from', { price: formatCents(pricing.fromPriceCents, locale) })
      : t('card.paid');
  return (
    <div className="flex h-5 min-w-0 flex-wrap items-baseline gap-x-2 overflow-hidden whitespace-nowrap">
      <Text size="sm" weight="medium" numeric>
        {label}
      </Text>
      {pricing.trialDays !== undefined && (
        <Text size="xs" tone="subtle">
          {t('card.trial', { days: pricing.trialDays })}
        </Text>
      )}
    </div>
  );
}
