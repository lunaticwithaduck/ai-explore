import type { UserCollection, WithId } from '@ai-explore/schemas';
import { accentSubtleClass, Card, cn, Skeleton, Text } from '@ai-explore/ui';
import { Folder } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { AccountSection } from '../AccountSection/AccountSection';

export type ProfileCollectionsProps = {
  collections: WithId<UserCollection>[] | undefined;
};

export function ProfileCollections({ collections }: ProfileCollectionsProps) {
  const t = useTranslations('account');
  return (
    <AccountSection headingId="profile-collections-heading" title={t('profile.collections.title')}>
      {collections === undefined ? (
        <Skeleton shape="card" className="h-20" />
      ) : collections.length === 0 ? (
        <Text tone="muted">{t('profile.collections.empty')}</Text>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <li key={collection.id} data-id={collection.id}>
              <Card variant="interactive" padding="sm" className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-button',
                    accentSubtleClass[collection.color],
                  )}
                >
                  <Folder aria-hidden className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <Text weight="semibold" clamp={1}>
                    <Link
                      href={routes.myCollection(collection.id)}
                      className="after:absolute after:inset-0"
                    >
                      {collection.name}
                    </Link>
                  </Text>
                  <Text size="xs" tone="muted">
                    {t('profile.collections.toolCount', { count: collection.toolIds.length })}
                  </Text>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AccountSection>
  );
}
