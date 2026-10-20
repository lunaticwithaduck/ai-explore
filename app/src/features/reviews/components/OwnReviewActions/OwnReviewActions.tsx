'use client';

import { Button } from '@ai-explore/ui';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { DeleteReviewDialog } from '../DeleteReviewDialog/DeleteReviewDialog';
import { ownReviewActionsStyles as styles } from './OwnReviewActions.styles';

export type OwnReviewActionsProps = {
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function OwnReviewActions({ disabled, onEdit, onDelete }: OwnReviewActionsProps) {
  const t = useTranslations('reviews.own');
  return (
    <div className={styles.root}>
      <Button
        variant="ghost"
        size="sm"
        iconLeft={Pencil}
        disabled={disabled}
        onClick={onEdit}
        data-testid={TEST_IDS.reviews.edit}
      >
        {t('edit')}
      </Button>
      <DeleteReviewDialog disabled={disabled} onConfirm={onDelete} />
    </div>
  );
}
