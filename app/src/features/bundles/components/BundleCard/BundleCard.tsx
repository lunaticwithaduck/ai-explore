import type { Bundle, Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { accentSubtleClass, Badge, Card, cn, Heading, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { formatCents } from '@/lib/format/money';
import { bundleIcon } from '../../config/icons';
import { includedTools, summarizeBundle } from '../../utils/bundleSummary';
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
  const Icon = bundleIcon(bundle.icon);
  return (
    <Card
      variant="interactive"
      padding="lg"
      className={bundleCardStyles.card}
      data-testid={TEST_IDS.bundles.card}
      data-id={bundle.slug}
    >
      <div className={bundleCardStyles.top}>
        <span className={cn(bundleCardStyles.icon, accentSubtleClass[bundle.accent])}>
          <Icon aria-hidden className="size-6" />
        </span>
        <div className={bundleCardStyles.priceBlock}>
          <Text as="span" size="lg" weight="semibold" numeric>
            {formatCents(summary.priceCents, locale)}
          </Text>
          <Text as="span" size="xs" tone="subtle">
            {t('card.perMonth')}
          </Text>
          {summary.savingsPercent > 0 && (
            <Badge tone="success" size="sm">
              {t('card.save', { percent: summary.savingsPercent })}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Heading level={3} size="md">
          <Link
            href={routes.bundle(bundle.slug)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {pickLocalized(bundle.name, locale)}
          </Link>
        </Heading>
        <Text size="sm" tone="muted" clamp={2}>
          {pickLocalized(bundle.description, locale)}
        </Text>
      </div>
      <div className="mt-auto flex items-center gap-3">
        <BundleToolLogos tools={included} />
        <Text as="span" size="sm" tone="muted">
          {t('card.toolsIncluded', { count: bundle.toolIds.length })}
        </Text>
      </div>
    </Card>
  );
}
