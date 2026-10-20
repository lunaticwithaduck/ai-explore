import type { Category, Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Badge, Button, Card, Heading, StarRating, Text, ToolLogo } from '@ai-explore/ui';
import { ExternalLink } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { env } from '@/config/env';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { CompareLink } from '@/features/compare/components/CompareLink/CompareLink';
import { AddToCollectionMenu } from '@/features/my-library/components/AddToCollectionMenu/AddToCollectionMenu';
import { SaveToolButton } from '@/features/my-library/components/SaveToolButton/SaveToolButton';
import { ShareButton } from '@/features/share/components/ShareButton/ShareButton';
import { Link } from '@/i18n/navigation';
import { averageRating, formatAverage } from '@/lib/format/rating';

export type ToolHeaderProps = {
  tool: WithId<Tool>;
  category: WithId<Category> | null;
  similar: WithId<Tool>[];
};

export function ToolHeader({ tool, category, similar }: ToolHeaderProps) {
  const t = useTranslations('tool.header');
  const locale = useLocale() as Locale;
  const average = averageRating(tool.rating);
  const averageText = average === null ? null : formatAverage(average, locale);
  return (
    <Card asChild padding="lg">
      <header data-testid={TEST_IDS.tool.header}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <ToolLogo
            src={tool.logo.path}
            alt={tool.name}
            background={tool.logo.background}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Heading level={1}>{tool.name}</Heading>
              {category && <Badge tone="accent">{pickLocalized(category.name, locale)}</Badge>}
            </div>
            <Text size="sm" tone="muted">
              {t('developer', { developer: tool.developer })}
            </Text>
            <Text tone="muted" className="mt-3">
              {pickLocalized(tool.tagline, locale)}
            </Text>
            <div className="mt-3 flex items-center gap-2">
              <StarRating
                value={average ?? 0}
                label={
                  averageText === null ? t('noRating') : t('ratingLabel', { average: averageText })
                }
                valueText={averageText ?? undefined}
              />
              {averageText === null && (
                <Text as="span" size="sm" tone="subtle">
                  {t('noRating')}
                </Text>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
          <SaveToolButton toolId={tool.id} />
          <AddToCollectionMenu toolId={tool.id} />
          <ShareButton
            url={`${env.NEXT_PUBLIC_SITE_URL}${routes.tool(tool.slug)}`}
            title={tool.name}
          />
          <CompareLink toolId={tool.id} otherToolId={similar[0]?.id} />
          <Button
            asChild
            size="lg"
            iconRight={ExternalLink}
            className="order-first w-full sm:order-last sm:ml-auto sm:w-auto"
          >
            <Link
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={TEST_IDS.tool.openButton}
            >
              {t('open')}
            </Link>
          </Button>
        </div>
      </header>
    </Card>
  );
}
