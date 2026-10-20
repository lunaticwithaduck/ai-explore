'use client';

import { Button, Text } from '@ai-explore/ui';
import { ThumbsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReviewDoc } from '@/api/endpoints/reviews';
import { TEST_IDS } from '@/config/test-ids';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { signInHref } from '@/features/auth/utils/nextParam';
import { Link, usePathname } from '@/i18n/navigation';
import { useHelpfulVote } from '../../hooks/useHelpfulVote';
import { helpfulButtonStyles as styles } from './HelpfulButton.styles';

export type HelpfulButtonProps = {
  toolId: string;
  review: ReviewDoc;
  viewerUid: string | null;
};

export function HelpfulButton({ toolId, review, viewerUid }: HelpfulButtonProps) {
  const t = useTranslations('reviews.item');
  const tErrors = useTranslations('errors');
  const { status } = useCurrentUser();
  const pathname = usePathname();
  const vote = useHelpfulVote(toolId, review.authorUid, viewerUid);
  const label = t('helpful', { count: review.helpfulCount });

  if (status === 'signedOut')
    return (
      <Button asChild variant="ghost" size="sm" iconLeft={ThumbsUp} className={styles.button}>
        <Link href={signInHref(pathname)} data-testid={TEST_IDS.reviews.helpful}>
          {label}
        </Link>
      </Button>
    );

  return (
    <div className={styles.root}>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={ThumbsUp}
        aria-pressed={vote.voted}
        disabled={!vote.ready}
        loading={vote.pending}
        onClick={vote.toggle}
        className={styles.button}
        data-testid={TEST_IDS.reviews.helpful}
      >
        {label}
      </Button>
      {vote.error && (
        <Text as="span" size="xs" tone="danger" role="alert">
          {tErrors(vote.error)}
        </Text>
      )}
    </div>
  );
}
