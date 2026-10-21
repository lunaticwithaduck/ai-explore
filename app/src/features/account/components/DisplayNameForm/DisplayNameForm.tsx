'use client';

import { Button, Input, Label, Text } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateProfileMutation } from '@/api/endpoints/profile';
import { type AppErrorCode, toAppError } from '@/api/errors';
import { TEST_IDS } from '@/config/test-ids';
import { AuthAlert } from '@/features/auth/components/AuthAlert/AuthAlert';
import { type DisplayNameValues, displayNameSchema } from '../../config/schemas';
import { updateAuthDisplayName } from '../../utils/accountActions';
import { AccountEmailField } from '../AccountEmailField/AccountEmailField';

export type DisplayNameFormProps = {
  uid: string;
  displayName: string;
  email?: string | null | undefined;
};

type Status = { tone: 'success' } | { tone: 'danger'; code: AppErrorCode } | null;

export function DisplayNameForm({ uid, displayName, email }: DisplayNameFormProps) {
  const t = useTranslations('account');
  const tErrors = useTranslations('errors');
  const [updateProfile] = useUpdateProfileMutation();
  const [status, setStatus] = useState<Status>(null);
  const { register, handleSubmit, formState, reset } = useForm<DisplayNameValues>({
    resolver: zodResolver(displayNameSchema),
    values: { displayName },
  });
  const error = formState.errors.displayName?.message;

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null);
    const result = await updateProfile({ uid, patch: { displayName: values.displayName } });
    if ('error' in result) {
      setStatus({ tone: 'danger', code: toAppError(result.error).code });
      return;
    }
    try {
      await updateAuthDisplayName(values.displayName);
    } catch {
      setStatus({ tone: 'danger', code: 'unknown' });
      return;
    }
    reset({ displayName: values.displayName });
    setStatus({ tone: 'success' });
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="settings-display-name">{t('settings.displayName.label')}</Label>
        <Input
          id="settings-display-name"
          autoComplete="nickname"
          invalid={Boolean(error)}
          aria-describedby={error ? 'settings-display-name-error' : undefined}
          data-testid={TEST_IDS.account.displayNameInput}
          {...register('displayName')}
        />
        {error && (
          <Text id="settings-display-name-error" size="xs" tone="danger">
            {t(error)}
          </Text>
        )}
      </div>
      {email && <AccountEmailField email={email} />}
      {status?.tone === 'success' && <AuthAlert tone="success" message={t('settings.saved')} />}
      {status?.tone === 'danger' && <AuthAlert message={tErrors(status.code)} />}
      <Button
        type="submit"
        className="self-start"
        loading={formState.isSubmitting}
        disabled={!formState.isDirty}
        data-testid={TEST_IDS.account.save}
      >
        {t('save')}
      </Button>
    </form>
  );
}
