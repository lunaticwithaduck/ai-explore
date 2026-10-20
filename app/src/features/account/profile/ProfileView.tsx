'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { skipToken } from '@reduxjs/toolkit/query';
import { useProfileSummaryQuery } from '@/api/endpoints/profile';
import { useCurrentProfile } from '@/features/auth/hooks/useCurrentProfile';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AccountBackButton } from '../components/AccountBackButton/AccountBackButton';
import { ProfileCollections } from '../components/ProfileCollections/ProfileCollections';
import { ProfileHeader } from '../components/ProfileHeader/ProfileHeader';
import { ProfileReviews } from '../components/ProfileReviews/ProfileReviews';
import { ProfileStats } from '../components/ProfileStats/ProfileStats';
import { RECENT_REVIEWS_LIMIT } from '../config/constants';

export type ProfileViewProps = {
  tools: WithId<Tool>[];
};

export function ProfileView({ tools }: ProfileViewProps) {
  const { user } = useCurrentUser();
  const { profile } = useCurrentProfile();
  const { currentData: summary } = useProfileSummaryQuery(
    user ? { uid: user.uid, recentLimit: RECENT_REVIEWS_LIMIT } : skipToken,
  );
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8 sm:px-6">
      <AccountBackButton />
      <ProfileHeader
        name={profile?.displayName ?? user?.displayName ?? ''}
        photoUrl={profile?.photoUrl ?? user?.photoUrl ?? null}
        memberSince={profile?.createdAt ?? null}
      />
      <ProfileStats
        saved={summary?.savedCount}
        collections={summary?.collections.length}
        reviews={summary?.reviewCount}
      />
      <ProfileReviews reviews={summary?.recentReviews} tools={tools} />
      <ProfileCollections collections={summary?.collections} />
    </main>
  );
}
