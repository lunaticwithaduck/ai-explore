import type { Locale, Plan } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Badge, Card, cn, Heading, Text, TextLink } from '@ai-explore/ui';
import { Check, ExternalLink } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePlanPriceLabel } from '../../hooks/usePlanPriceLabel';
import { getPlanPrice } from '../../utils/planPrice';
import { planCardStyles } from './PlanCard.styles';

export type PlanCardProps = {
  plan: Plan;
  websiteUrl: string;
};

export function PlanCard({ plan, websiteUrl }: PlanCardProps) {
  const t = useTranslations('tool.plans');
  const locale = useLocale() as Locale;
  const price = usePlanPriceLabel(plan);
  const popular = plan.popular === true;
  return (
    <Card
      variant="flat"
      className={cn(planCardStyles.base, popular && planCardStyles.popular)}
      data-id={plan.name}
      data-popular={popular || undefined}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <Heading level={3} size="md">
          {plan.name}
        </Heading>
        {popular && <Badge tone="solid">{t('popular')}</Badge>}
      </div>
      <div className="mb-4 flex flex-wrap items-baseline gap-1">
        <Text as="span" size="lg" weight="semibold" numeric className="text-2xl">
          {price.amount}
        </Text>
        {price.period && (
          <Text as="span" size="sm" tone="muted">
            {price.period}
          </Text>
        )}
      </div>
      <ul className="mb-2 flex flex-col gap-2">
        {plan.features.map((feature) => (
          <li key={feature.en} className="flex items-start gap-2">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            <Text as="span" size="sm" tone="muted">
              {pickLocalized(feature, locale)}
            </Text>
          </li>
        ))}
      </ul>
      {getPlanPrice(plan).kind === 'custom' && (
        <Text size="sm" weight="medium" className="mt-auto pt-3">
          <TextLink href={websiteUrl} target="_blank" rel="noopener noreferrer">
            {t('contactSales')}
            <ExternalLink aria-hidden className="ml-1 inline size-3.5" />
          </TextLink>
        </Text>
      )}
    </Card>
  );
}
