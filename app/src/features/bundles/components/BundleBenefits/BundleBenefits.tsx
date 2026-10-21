import { Card, Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { BUNDLE_BENEFITS } from '../../config/constants';
import { bundleBenefitsStyles } from './BundleBenefits.styles';

type BundleBenefitsProps = {
  savingsPercent: number;
};

export function BundleBenefits({ savingsPercent }: BundleBenefitsProps) {
  const t = useTranslations('bundles');
  return (
    <Card
      asChild
      padding="none"
      className={bundleBenefitsStyles.card}
      aria-labelledby="bundle-benefits-title"
    >
      <section>
        <Heading level={2} size="lg" id="bundle-benefits-title">
          {t('benefits.title')}
        </Heading>
        <div className={bundleBenefitsStyles.grid}>
          {BUNDLE_BENEFITS.map(({ key, icon: Icon }) => (
            <div key={key} className={bundleBenefitsStyles.item}>
              <span className={bundleBenefitsStyles.tile}>
                <Icon aria-hidden className={bundleBenefitsStyles.icon} />
              </span>
              <Heading level={3} size="md" className={bundleBenefitsStyles.title}>
                {t(`benefits.${key}.title`)}
              </Heading>
              <Text size="sm" tone="muted">
                {t(`benefits.${key}.body`, { percent: savingsPercent })}
              </Text>
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}
