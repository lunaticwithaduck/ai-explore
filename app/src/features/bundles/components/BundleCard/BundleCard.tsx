import type { Bundle, Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Button, Card, cn, Heading, Text } from '@ai-explore/ui';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { BUNDLE_GRADIENTS } from '../../config/gradients';
import { bundleIcon } from '../../config/icons';
import { includedTools, summarizeBundle } from '../../utils/bundleSummary';
import { BundleCardPrice } from '../BundleCardPrice/BundleCardPrice';
import { BundleToolLogos } from '../BundleToolLogos/BundleToolLogos';
import { bundleCardStyles } from './BundleCard.styles';

type BundleCardProps = {
  bundle: WithId<Bundle>;
  tools: WithId<Tool>[];
};

export function BundleCard({ bundle, tools }: BundleCardProps) {
  const t = useTranslations('bundles');
  const locale = useLocale() as Locale;
  const included = includedTools(bundle, tools);
  const summary = summarizeBundle(bundle, included, 'monthly');
  const gradient = BUNDLE_GRADIENTS[bundle.accent];
  const Icon = bundleIcon(bundle.icon);
  return (
    <Card
      variant="interactive"
      padding="none"
      className={bundleCardStyles.card}
      data-testid={TEST_IDS.bundles.card}
      data-id={bundle.slug}
    >
      <span aria-hidden className={cn(bundleCardStyles.tint, gradient)} />
      <div className={bundleCardStyles.top}>
        <span className={cn(bundleCardStyles.icon, gradient)}>
          <Icon aria-hidden className="size-6" />
        </span>
        <BundleCardPrice summary={summary} />
      </div>
      <Heading level={3} size="md" className={bundleCardStyles.title}>
        <Link href={routes.bundle(bundle.slug)} className={bundleCardStyles.link}>
          {pickLocalized(bundle.name, locale)}
        </Link>
      </Heading>
      <Text size="sm" tone="muted" clamp={2} className={bundleCardStyles.description}>
        {pickLocalized(bundle.description, locale)}
      </Text>
      <div className={bundleCardStyles.footer}>
        <div className={bundleCardStyles.tools}>
          <BundleToolLogos tools={included} />
          <Text as="span" size="sm" tone="muted">
            {t('card.toolsIncluded', { count: bundle.toolIds.length })}
          </Text>
        </div>
        <Button asChild fullWidth className={bundleCardStyles.view}>
          <span aria-hidden>
            {t('card.view')}
            <ChevronRight className={bundleCardStyles.chevron} />
          </span>
        </Button>
      </div>
    </Card>
  );
}
