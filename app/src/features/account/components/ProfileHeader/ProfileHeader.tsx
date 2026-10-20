'use client';

import { Avatar, Heading, Text } from '@ai-explore/ui';
import { useFormatter, useTranslations } from 'next-intl';
import { initials } from '@/features/auth/utils/initials';

export type ProfileHeaderProps = {
  name: string;
  photoUrl: string | null;
  memberSince: Date | null;
};

export function ProfileHeader({ name, photoUrl, memberSince }: ProfileHeaderProps) {
  const t = useTranslations('account');
  const format = useFormatter();
  return (
    <header className="flex items-center gap-4 sm:gap-6">
      <Avatar size="xl" src={photoUrl ?? undefined} alt={name} fallback={initials(name)} />
      <div className="flex min-w-0 flex-col gap-1">
        <Heading level={1} className="break-words">
          {name}
        </Heading>
        {memberSince && (
          <Text size="sm" tone="muted">
            {t('profile.memberSince', {
              date: format.dateTime(memberSince, { year: 'numeric', month: 'long' }),
            })}
          </Text>
        )}
      </div>
    </header>
  );
}
