'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { Card } from '@ai-explore/ui';
import { skipToken } from '@reduxjs/toolkit/query';
import { useTranslations } from 'next-intl';
import { useProfileSummaryQuery } from '@/api/endpoints/profile';
import { routes } from '@/config/routes';
import { useCurrentProfile } from '@/features/auth/hooks/useCurrentProfile';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AccountBackButton } from '../components/AccountBackButton/AccountBackButton';
import { AccountPage } from '../components/AccountPage/AccountPage';
import { ProfileCollections } from '../components/ProfileCollections/ProfileCollections';
import { ProfileHeader } from '../components/ProfileHeader/ProfileHeader';
import { ProfileReviews } from '../components/ProfileReviews/ProfileReviews';
import { ProfileSavedTools } from '../components/ProfileSavedTools/ProfileSavedTools';
import { ProfileStats } from '../components/ProfileStats/ProfileStats';
import { RECENT_REVIEWS_LIMIT } from '../config/constants';

export type ProfileViewProps = {
  tools: WithId<Tool>[];
};

export function ProfileView({ tools }: ProfileViewProps) {
  const t = useTranslations('account');
  const { user } = useCurrentUser();
  const { profile } = useCurrentProfile();
  const { currentData: summary } = useProfileSummaryQuery(
    user ? { uid: user.uid, recentLimit: RECENT_REVIEWS_LIMIT } : skipToken,
  );
  const memberSince = profile === undefined ? undefined : (profile?.createdAt ?? null);
  return (
    <AccountPage
      tone="profile"
      width="wide"
      back={<AccountBackButton label={t('backToLibrary')} href={routes.library} />}
    >
      <Card padding="none" className="flex flex-col gap-6 p-5 sm:gap-8 sm:p-8">
        <ProfileHeader
          name={profile?.displayName ?? user?.displayName ?? ''}
          email={user?.email ?? null}
          photoUrl={profile?.photoUrl ?? user?.photoUrl ?? null}
          memberSince={memberSince ?? null}
        />
        <ProfileStats
          saved={summary?.savedCount}
          collections={summary?.collections.length}
          reviews={summary?.reviewCount}
          memberSince={memberSince}
        />
      </Card>
      <ProfileSavedTools tools={tools} />
      <ProfileCollections collections={summary?.collections} />
      <ProfileReviews reviews={summary?.recentReviews} tools={tools} />
    </AccountPage>
  );
}
