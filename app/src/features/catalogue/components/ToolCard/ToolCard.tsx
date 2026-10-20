'use client';

import { pickLocalized, type Tool, type WithId } from '@ai-explore/schemas';
import { Card, Heading, Text, TextLink, ToolLogo } from '@ai-explore/ui';
import { useLocale } from 'next-intl';
import type { ReactNode } from 'react';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { ToolCardPrice } from './ToolCardPrice';
import { ToolCardRating } from './ToolCardRating';

export type ToolCardProps = {
  tool: WithId<Tool>;
  categoryName?: string | undefined;
  actions?: ReactNode;
};

export function ToolCard({ tool, categoryName, actions }: ToolCardProps) {
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  return (
    <Card
      variant="interactive"
      padding="sm"
      data-testid={TEST_IDS.library.toolCard}
      data-id={tool.slug}
      className="flex h-full flex-col gap-3 sm:p-4"
    >
      <div className="flex items-center gap-3 pr-10">
        <ToolLogo
          size="md"
          src={tool.logo.path}
          alt={tool.name}
          background={tool.logo.background}
          data-testid={TEST_IDS.library.cardLogo}
          className="shrink-0"
        />
        <div className="flex min-w-0 flex-col">
          <Heading level={3} size="sm" className="truncate">
            <TextLink asChild tone="inherit" underline="none">
              <Link href={routes.tool(tool.slug)} className="after:absolute after:inset-0">
                {tool.name}
              </Link>
            </TextLink>
          </Heading>
          {categoryName && (
            <Text size="xs" tone="subtle" className="truncate">
              {categoryName}
            </Text>
          )}
        </div>
      </div>
      <Text size="sm" tone="muted" clamp={2}>
        {pickLocalized(tool.tagline, locale)}
      </Text>
      <div
        data-testid={TEST_IDS.library.cardPriceRow}
        className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
      >
        <ToolCardPrice pricing={tool.pricing} locale={locale} />
        <ToolCardRating rating={tool.rating} locale={locale} />
      </div>
      {actions && <div className="absolute right-2 top-2 z-10">{actions}</div>}
    </Card>
  );
}
