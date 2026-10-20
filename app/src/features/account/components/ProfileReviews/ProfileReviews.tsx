import type { Review, Tool, WithId } from '@ai-explore/schemas';
import { Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { AccountSection } from '../AccountSection/AccountSection';
import { ProfileReviewItem } from '../ProfileReviewItem/ProfileReviewItem';

export type ProfileReviewsProps = {
  reviews: WithId<Review>[] | undefined;
  tools: WithId<Tool>[];
};

export function ProfileReviews({ reviews, tools }: ProfileReviewsProps) {
  const t = useTranslations('account');
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const rows = (reviews ?? []).flatMap((review) => {
    const tool = toolBySlug.get(review.toolId);
    return tool ? [{ review, tool }] : [];
  });
  return (
    <AccountSection headingId="profile-reviews-heading" title={t('profile.reviews.title')}>
      {reviews === undefined ? (
        <Skeleton shape="card" className="h-24" />
      ) : rows.length === 0 ? (
        <Text tone="muted">{t('profile.reviews.empty')}</Text>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {rows.map(({ review, tool }) => (
            <ProfileReviewItem key={review.id} review={review} tool={tool} />
          ))}
        </ul>
      )}
    </AccountSection>
  );
}
