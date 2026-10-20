import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import { Heading, Text, TextLink } from '@ai-explore/ui';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { BundleCard } from '../BundleCard/BundleCard';

export type BundlesSectionProps = {
  bundles: WithId<Bundle>[];
  tools: WithId<Tool>[];
};

export function BundlesSection({ bundles, tools }: BundlesSectionProps) {
  const t = useTranslations('bundles');
  if (bundles.length === 0) return null;
  return (
    <section className="flex flex-col gap-4" aria-labelledby="bundles-section-title">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Heading level={2} id="bundles-section-title">
            {t('section.title')}
          </Heading>
          <Text size="sm" tone="muted">
            {t('section.subtitle')}
          </Text>
        </div>
        <TextLink asChild size="sm" iconRight={ArrowRight} className="shrink-0">
          <Link href={routes.bundles} className="whitespace-nowrap">
            {t('section.seeAll')}
          </Link>
        </TextLink>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} tools={tools} />
        ))}
      </div>
    </section>
  );
}
