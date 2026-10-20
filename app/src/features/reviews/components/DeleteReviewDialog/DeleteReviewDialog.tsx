'use client';

import { Button, Dialog, DialogClose } from '@ai-explore/ui';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { deleteReviewDialogStyles as styles } from './DeleteReviewDialog.styles';

export type DeleteReviewDialogProps = {
  disabled: boolean;
  onConfirm: () => void;
};

export function DeleteReviewDialog({ disabled, onConfirm }: DeleteReviewDialogProps) {
  const t = useTranslations('reviews');
  return (
    <Dialog
      size="sm"
      title={t('delete.title')}
      description={t('delete.description')}
      closeLabel={t('delete.close')}
      trigger={
        <Button
          variant="ghost"
          size="sm"
          iconLeft={Trash2}
          disabled={disabled}
          className={styles.trigger}
          data-testid={TEST_IDS.reviews.delete}
        >
          {t('own.delete')}
        </Button>
      }
      footer={
        <>
          <DialogClose asChild>
            <Button variant="secondary">{t('delete.cancel')}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="danger"
              iconLeft={Trash2}
              onClick={onConfirm}
              data-testid={TEST_IDS.reviews.confirmDelete}
            >
              {t('delete.confirm')}
            </Button>
          </DialogClose>
        </>
      }
    />
  );
}
