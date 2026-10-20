'use client';

import { Button, TextLink } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { type SignInValues, signInSchema } from '../../config/schemas';
import { signInWithEmail } from '../../utils/authActions';
import { type AuthErrorKey, toAuthErrorKey } from '../../utils/authErrors';
import { AuthField } from '../AuthField/AuthField';

export type SignInFormProps = {
  disabled?: boolean;
  onBusyChange: (busy: boolean) => void;
  onError: (error: AuthErrorKey | null) => void;
};

export function SignInForm({ disabled = false, onBusyChange, onError }: SignInFormProps) {
  const t = useTranslations('auth');
  const { register, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const fieldError = (message?: string) => (message ? t(message) : undefined);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    onError(null);
    onBusyChange(true);
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      onError(toAuthErrorKey(error));
    } finally {
      onBusyChange(false);
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <AuthField
        id="sign-in-email"
        type="email"
        autoComplete="email"
        label={t('fields.email')}
        placeholder={t('fields.emailPlaceholder')}
        error={fieldError(formState.errors.email?.message)}
        data-testid={TEST_IDS.auth.email}
        {...register('email')}
      />
      <AuthField
        id="sign-in-password"
        type="password"
        autoComplete="current-password"
        label={t('fields.password')}
        error={fieldError(formState.errors.password?.message)}
        data-testid={TEST_IDS.auth.password}
        labelAction={
          <TextLink asChild size="xs" tone="muted">
            <Link href={routes.resetPassword}>{t('signIn.forgotPassword')}</Link>
          </TextLink>
        }
        {...register('password')}
      />
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={formState.isSubmitting}
        disabled={disabled}
        data-testid={TEST_IDS.auth.submit}
      >
        {t('signIn.submit')}
      </Button>
    </form>
  );
}
