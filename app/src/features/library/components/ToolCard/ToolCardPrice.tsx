import type { Locale, Tool } from '@ai-explore/schemas';
import { Badge, Text } from '@ai-explore/ui';
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
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <Text weight="medium" numeric>
        {label}
      </Text>
      {pricing.trialDays !== undefined && (
        <Badge tone="accent" size="sm">
          {t('card.trial', { days: pricing.trialDays })}
        </Badge>
      )}
    </div>
  );
}
