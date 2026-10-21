import type { UserCollection, WithId } from '@ai-explore/schemas';
import { Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { AccountSection } from '../AccountSection/AccountSection';
import { ProfileCollectionTile } from '../ProfileCollectionTile/ProfileCollectionTile';

export type ProfileCollectionsProps = {
  collections: WithId<UserCollection>[] | undefined;
};

export function ProfileCollections({ collections }: ProfileCollectionsProps) {
  const t = useTranslations('account');
  return (
    <AccountSection
      headingId="profile-collections-heading"
      title={t('profile.collections.title')}
      action={
        collections && (
          <Text size="sm" tone="muted" className="shrink-0">
            {t('profile.collections.count', { count: collections.length })}
          </Text>
        )
      }
    >
      {collections === undefined ? (
        <Skeleton shape="card" className="h-20" />
      ) : collections.length === 0 ? (
        <Text tone="muted">{t('profile.collections.empty')}</Text>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id} data-id={collection.id}>
              <ProfileCollectionTile collection={collection} />
            </li>
          ))}
        </ul>
      )}
    </AccountSection>
  );
}
