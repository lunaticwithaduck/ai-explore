import type { UserCollection, WithId } from '@ai-explore/schemas';
import { accentSubtleClass, cn, Heading, Text, TextLink } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { collectionIcon } from '@/features/my-library/config/constants';
import { Link } from '@/i18n/navigation';
import { ProfileTile } from '../ProfileTile/ProfileTile';

export type ProfileCollectionTileProps = {
  collection: WithId<UserCollection>;
};

export function ProfileCollectionTile({ collection }: ProfileCollectionTileProps) {
  const t = useTranslations('account');
  const Icon = collectionIcon(collection.icon);
  return (
    <ProfileTile className="flex items-center gap-3">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-button',
          accentSubtleClass[collection.color],
        )}
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <Heading level={3} size="xs" className="truncate">
          <TextLink asChild tone="inherit" underline="none">
            <Link
              href={routes.myCollection(collection.id)}
              className="outline-none after:absolute after:inset-0"
            >
              {collection.name}
            </Link>
          </TextLink>
        </Heading>
        <Text size="xs" tone="muted">
          {t('profile.collections.toolCount', { count: collection.toolIds.length })}
        </Text>
      </div>
    </ProfileTile>
  );
}
