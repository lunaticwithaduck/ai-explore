'use client';

import { Button, Dialog, DialogClose, Text } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthField } from '@/features/auth/components/AuthField/AuthField';
import { type CollectionNameValues, collectionNameFormSchema } from '../../config/schemas';

export type CollectionNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  initialName?: string;
  onSubmit: (name: string) => Promise<string | null>;
  inputTestId?: string;
  submitTestId?: string;
};

export function CollectionNameDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  initialName = '',
  onSubmit,
  inputTestId,
  submitTestId,
}: CollectionNameDialogProps) {
  const t = useTranslations('myLibrary');
  const te = useTranslations('errors');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState, reset } = useForm<CollectionNameValues>({
    resolver: zodResolver(collectionNameFormSchema),
    defaultValues: { name: initialName },
  });

  useEffect(() => {
    if (open) {
      reset({ name: initialName });
      setSubmitError(null);
    }
  }, [open, initialName, reset]);

  const submit = handleSubmit(async ({ name }) => {
    setSubmitError(null);
    const errorCode = await onSubmit(name);
    if (errorCode) setSubmitError(errorCode);
    else onOpenChange(false);
  });

  const fieldError = formState.errors.name?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} closeLabel={t('close')} size="sm">
      <form noValidate onSubmit={submit} className="flex flex-col gap-4">
        <AuthField
          id="collection-name"
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          autoComplete="off"
          error={fieldError ? t(fieldError) : undefined}
          data-testid={inputTestId}
          {...register('name')}
        />
        {submitError && (
          <Text role="alert" size="sm" tone="danger">
            {te(submitError)}
          </Text>
        )}
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button type="submit" loading={formState.isSubmitting} data-testid={submitTestId}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
