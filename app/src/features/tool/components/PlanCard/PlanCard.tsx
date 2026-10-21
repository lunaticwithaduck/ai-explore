import type { Locale, Plan } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Badge, Button, Card, cn, Heading, Text } from '@ai-explore/ui';
import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePlanPriceLabel } from '../../hooks/usePlanPriceLabel';
import { getPlanPrice } from '../../utils/planPrice';
import { planCardStyles as styles } from './PlanCard.styles';

export type PlanCardProps = {
  plan: Plan;
  websiteUrl: string;
};

const ACTION_KEY = {
  free: 'getStarted',
  custom: 'contactSales',
  month: 'choose',
  year: 'choose',
} as const;

export function PlanCard({ plan, websiteUrl }: PlanCardProps) {
  const t = useTranslations('tool.plans');
  const locale = useLocale() as Locale;
  const price = usePlanPriceLabel(plan);
  const popular = plan.popular === true;
  return (
    <Card
      variant="flat"
      padding="none"
      className={cn(styles.base, popular && styles.popular)}
      data-id={plan.name}
      data-popular={popular || undefined}
    >
      {popular && (
        <Badge tone="solid" className={styles.badge}>
          {t('popular')}
        </Badge>
      )}
      <Heading level={3} className={styles.name}>
        {plan.name}
      </Heading>
      <Text as="span" numeric className={styles.price}>
        {price}
      </Text>
      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature.en} className="flex items-start gap-2">
            <Check aria-hidden className={styles.check} />
            <Text as="span" size="sm" tone="muted">
              {pickLocalized(feature, locale)}
            </Text>
          </li>
        ))}
      </ul>
      <Button
        asChild
        variant={popular ? 'primary' : 'secondary'}
        fullWidth
        className={styles.action}
      >
        <Link href={websiteUrl} target="_blank" rel="noopener noreferrer">
          {t(ACTION_KEY[getPlanPrice(plan).kind])}
        </Link>
      </Button>
    </Card>
  );
}
