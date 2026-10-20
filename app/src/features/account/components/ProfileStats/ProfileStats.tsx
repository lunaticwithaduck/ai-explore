import { Card, Skeleton } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { PROFILE_STATS } from '../../config/constants';
import { profileStatsStyles } from './ProfileStats.styles';

export type ProfileStatsProps = {
  saved: number | undefined;
  collections: number | undefined;
  reviews: number | undefined;
};

export function ProfileStats({ saved, collections, reviews }: ProfileStatsProps) {
  const t = useTranslations('account');
  const values = { saved, collections, reviews };
  return (
    <dl className={profileStatsStyles.list}>
      {PROFILE_STATS.map((stat) => {
        const value = values[stat];
        return (
          <Card key={stat} padding="none" data-id={stat} className={profileStatsStyles.card}>
            <dt className={profileStatsStyles.term}>{t(`profile.stats.${stat}`)}</dt>
            <dd className={profileStatsStyles.value}>
              {value === undefined ? (
                <Skeleton shape="text" className={profileStatsStyles.loading} />
              ) : (
                value
              )}
            </dd>
          </Card>
        );
      })}
    </dl>
  );
}
