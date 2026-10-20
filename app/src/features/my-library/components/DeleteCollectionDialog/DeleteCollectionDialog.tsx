'use client';

import { Button, Dialog, DialogClose, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';

export type DeleteCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  errorCode: string | null;
  onConfirm: () => void;
};

export function DeleteCollectionDialog({
  open,
  onOpenChange,
  name,
  errorCode,
  onConfirm,
}: DeleteCollectionDialogProps) {
  const t = useTranslations('myLibrary');
  const te = useTranslations('errors');
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('deleteTitle', { name })}
      description={t('deleteBody')}
      closeLabel={t('close')}
      size="sm"
      footer={
        <>
          <DialogClose asChild>
            <Button variant="ghost">{t('cancel')}</Button>
          </DialogClose>
          <Button variant="danger" onClick={onConfirm}>
            {t('deleteConfirm')}
          </Button>
        </>
      }
    >
      {errorCode && (
        <Text role="alert" size="sm" tone="danger">
          {te(errorCode)}
        </Text>
      )}
    </Dialog>
  );
}
