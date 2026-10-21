'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { Button, Skeleton, Text, TextLink } from '@ai-explore/ui';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { useSavedTools } from '@/features/my-library/hooks/useSavedTools';
import { Link } from '@/i18n/navigation';
import { SAVED_TOOLS_PREVIEW } from '../../config/constants';
import { AccountSection } from '../AccountSection/AccountSection';
import { ProfileToolTile } from '../ProfileToolTile/ProfileToolTile';

export type ProfileSavedToolsProps = {
  tools: WithId<Tool>[];
};

export function ProfileSavedTools({ tools }: ProfileSavedToolsProps) {
  const t = useTranslations('account');
  const { ids, loaded } = useSavedTools();
  const saved = tools.filter((tool) => ids.has(tool.id)).slice(0, SAVED_TOOLS_PREVIEW);
  return (
    <AccountSection
      headingId="profile-saved-heading"
      title={t('profile.saved.title')}
      action={
        saved.length > 0 && (
          <TextLink asChild size="sm" className="shrink-0">
            <Link href={routes.myLibrary}>{t('profile.saved.viewAll')}</Link>
          </TextLink>
        )
      }
    >
      {!loaded ? (
        <Skeleton shape="card" className="h-32" />
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <Heart aria-hidden className="size-12 text-text-muted opacity-50" />
          <Text tone="muted">{t('profile.saved.empty')}</Text>
          <Button asChild>
            <Link href={routes.library}>{t('profile.saved.explore')}</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((tool) => (
            <li key={tool.id} data-id={tool.slug}>
              <ProfileToolTile tool={tool} />
            </li>
          ))}
        </ul>
      )}
    </AccountSection>
  );
}
