import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import { Heading, Text, TextLink } from '@ai-explore/ui';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { BundleGrid } from '../BundleGrid/BundleGrid';
import { bundlesSectionStyles } from './BundlesSection.styles';

export type BundlesSectionProps = {
  bundles: WithId<Bundle>[];
  tools: WithId<Tool>[];
};

export function BundlesSection({ bundles, tools }: BundlesSectionProps) {
  const t = useTranslations('bundles');
  if (bundles.length === 0) return null;
  return (
    <section className={bundlesSectionStyles.root} aria-labelledby="bundles-section-title">
      <div className={bundlesSectionStyles.header}>
        <div className={bundlesSectionStyles.titles}>
          <Heading level={2} size="lg" id="bundles-section-title">
            {t('section.title')}
          </Heading>
          <Text tone="muted">{t('section.subtitle')}</Text>
        </div>
        <TextLink asChild size="sm" iconRight={ArrowRight} className={bundlesSectionStyles.seeAll}>
          <Link href={routes.bundles}>{t('section.seeAll')}</Link>
        </TextLink>
      </div>
      <BundleGrid bundles={bundles} tools={tools} />
    </section>
  );
}
