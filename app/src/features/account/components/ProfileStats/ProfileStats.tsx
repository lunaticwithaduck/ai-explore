'use client';

import { cn, Skeleton } from '@ai-explore/ui';
import { Calendar, Folder, Heart, type LucideIcon, MessageSquareText } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { PROFILE_STATS, type ProfileStat } from '../../config/constants';
import { profileStatsStyles as styles } from './ProfileStats.styles';

export type ProfileStatsProps = {
  saved: number | undefined;
  collections: number | undefined;
  reviews: number | undefined;
  memberSince: Date | null | undefined;
};

const STAT_ICONS: Record<ProfileStat, LucideIcon> = {
  saved: Heart,
  collections: Folder,
  memberSince: Calendar,
  reviews: MessageSquareText,
};

export function ProfileStats({ saved, collections, reviews, memberSince }: ProfileStatsProps) {
  const t = useTranslations('account');
  const format = useFormatter();
  const since = memberSince && format.dateTime(memberSince, { year: 'numeric', month: 'short' });
  const values = { saved, collections, reviews, memberSince: since };
  return (
    <dl className={styles.list}>
      {PROFILE_STATS.map((stat) => {
        const value = values[stat];
        const Icon = STAT_ICONS[stat];
        return (
          <div key={stat} data-id={stat} className={styles.tile}>
            <dt className={styles.term}>
              <Icon aria-hidden className={cn(styles.icon, styles.tone[stat])} />
              <span className={styles.label}>{t(`profile.stats.${stat}`)}</span>
            </dt>
            <dd className={styles.value}>
              {value === undefined ? (
                <Skeleton shape="text" className={styles.loading} />
              ) : (
                (value ?? t('profile.stats.unknown'))
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
