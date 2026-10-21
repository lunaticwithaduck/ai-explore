'use client';

import { pickLocalized, type Tool, type WithId } from '@ai-explore/schemas';
import { Heading, Text, TextLink, ToolLogo } from '@ai-explore/ui';
import { useLocale } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { ProfileTile } from '../ProfileTile/ProfileTile';

export type ProfileToolTileProps = {
  tool: WithId<Tool>;
};

export function ProfileToolTile({ tool }: ProfileToolTileProps) {
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  return (
    <ProfileTile className="flex flex-col gap-3">
      <ToolLogo size="md" src={tool.logo.path} alt={tool.name} background={tool.logo.background} />
      <div className="flex min-w-0 flex-col gap-1">
        <Heading level={3} size="xs" className="truncate">
          <TextLink asChild tone="inherit" underline="none">
            <Link
              href={routes.tool(tool.slug)}
              className="outline-none after:absolute after:inset-0"
            >
              {tool.name}
            </Link>
          </TextLink>
        </Heading>
        <Text size="xs" tone="muted" clamp={2}>
          {pickLocalized(tool.tagline, locale)}
        </Text>
      </div>
    </ProfileTile>
  );
}
