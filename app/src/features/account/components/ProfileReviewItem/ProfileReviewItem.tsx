import type { Review, Tool, WithId } from '@ai-explore/schemas';
import { StarRating, Text, TextLink, ToolLogo } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';

export type ProfileReviewItemProps = {
  review: WithId<Review>;
  tool: WithId<Tool>;
};

export function ProfileReviewItem({ review, tool }: ProfileReviewItemProps) {
  const t = useTranslations('account');
  return (
    <li data-id={review.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <ToolLogo src={tool.logo.path} alt={tool.name} background={tool.logo.background} size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Text weight="semibold">{tool.name}</Text>
          <StarRating
            value={review.rating}
            size="sm"
            label={t('profile.reviews.stars', { count: review.rating })}
          />
        </div>
        {review.body && (
          <Text size="sm" tone="muted" clamp={3}>
            {review.body}
          </Text>
        )}
        <TextLink asChild size="sm" className="self-start">
          <Link href={routes.tool(tool.slug)}>
            {t('profile.reviews.viewTool', { name: tool.name })}
          </Link>
        </TextLink>
      </div>
    </li>
  );
}
