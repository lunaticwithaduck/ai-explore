'use client';

import { Avatar, Button, Heading, Text } from '@ai-explore/ui';
import { Calendar, Mail, Pencil } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { initials } from '@/features/auth/utils/initials';
import { Link } from '@/i18n/navigation';
import { profileHeaderStyles as styles } from './ProfileHeader.styles';

export type ProfileHeaderProps = {
  name: string;
  email: string | null;
  photoUrl: string | null;
  memberSince: Date | null;
};

export function ProfileHeader({ name, email, photoUrl, memberSince }: ProfileHeaderProps) {
  const t = useTranslations('account');
  const format = useFormatter();
  return (
    <header className={styles.root}>
      <Avatar
        size="xl"
        src={photoUrl ?? undefined}
        alt={name}
        fallback={initials(name)}
        className={styles.avatar}
      />
      <div className={styles.info}>
        <div className={styles.identity}>
          <Heading level={1} className={styles.name}>
            {name}
          </Heading>
          <div className={styles.meta}>
            {email && (
              <span className={styles.metaItem}>
                <Mail aria-hidden className={styles.metaIcon} />
                <Text as="span" size="sm" tone="inherit" className="break-words">
                  {email}
                </Text>
              </span>
            )}
            {memberSince && (
              <span className={styles.metaItem}>
                <Calendar aria-hidden className={styles.metaIcon} />
                <Text as="span" size="sm" tone="inherit">
                  {t('profile.joined', {
                    date: format.dateTime(memberSince, { year: 'numeric', month: 'long' }),
                  })}
                </Text>
              </span>
            )}
          </div>
        </div>
        <Button asChild variant="secondary" iconLeft={Pencil} className={styles.edit}>
          <Link href={routes.settings}>{t('profile.editProfile')}</Link>
        </Button>
      </div>
    </header>
  );
}
