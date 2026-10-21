'use client';

import { pickLocalized, type Tool, type WithId } from '@ai-explore/schemas';
import { Card, Heading, Text, TextLink } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { toolCardStyles } from './ToolCard.styles';
import { ToolCardHeader } from './ToolCardHeader';
import { ToolCardPrice } from './ToolCardPrice';

export type ToolCardProps = {
  tool: WithId<Tool>;
  actions?: ReactNode;
};

export function ToolCard({ tool, actions }: ToolCardProps) {
  const t = useTranslations('library');
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  return (
    <Card
      variant="interactive"
      padding="none"
      data-testid={TEST_IDS.library.toolCard}
      data-id={tool.slug}
      className={toolCardStyles.card}
    >
      <ToolCardHeader tool={tool} locale={locale} />
      <div className={toolCardStyles.body}>
        <div className={toolCardStyles.titleRow}>
          <Heading level={3} size="md" className="min-w-0 break-words">
            <TextLink asChild tone="inherit" underline="none">
              <Link
                href={routes.tool(tool.slug)}
                className="outline-none after:absolute after:inset-0"
              >
                {tool.name}
              </Link>
            </TextLink>
          </Heading>
          {actions && <div className={toolCardStyles.actions}>{actions}</div>}
        </div>
        <Text size="sm" tone="muted" clamp={2} className="mb-4">
          {pickLocalized(tool.tagline, locale)}
        </Text>
        <div data-testid={TEST_IDS.library.cardPriceRow} className={toolCardStyles.bottomRow}>
          <ToolCardPrice pricing={tool.pricing} locale={locale} />
          <Text size="xs" tone="muted" numeric className="shrink-0 whitespace-nowrap">
            {t('card.reviewCount', { count: tool.rating.count })}
          </Text>
        </div>
      </div>
    </Card>
  );
}
