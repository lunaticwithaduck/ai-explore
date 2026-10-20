'use client';

import { Button } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { TEST_IDS } from '@/config/test-ids';
import { type ResetPasswordValues, resetPasswordSchema } from '../../config/schemas';
import { useAppLocale } from '../../hooks/useAppLocale';
import { requestPasswordReset } from '../../utils/authActions';
import { type AuthErrorKey, authErrorCode, toAuthErrorKey } from '../../utils/authErrors';
import { AuthField } from '../AuthField/AuthField';

export type ResetPasswordFormProps = {
  onSent: (email: string) => void;
  onError: (error: AuthErrorKey | null) => void;
};

export function ResetPasswordForm({ onSent, onError }: ResetPasswordFormProps) {
  const t = useTranslations('auth');
  const locale = useAppLocale();
  const { register, handleSubmit, formState } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    onError(null);
    try {
      await requestPasswordReset(email, locale);
      onSent(email);
    } catch (error) {
      if (authErrorCode(error) === 'auth/user-not-found') onSent(email);
      else onError(toAuthErrorKey(error));
    }
  });

  const emailError = formState.errors.email?.message;

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <AuthField
        id="reset-email"
        type="email"
        autoComplete="email"
        label={t('fields.email')}
        placeholder={t('fields.emailPlaceholder')}
        error={emailError ? t(emailError) : undefined}
        data-testid={TEST_IDS.auth.email}
        {...register('email')}
      />
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={formState.isSubmitting}
        data-testid={TEST_IDS.auth.submit}
      >
        {t('reset.submit')}
      </Button>
    </form>
  );
}
