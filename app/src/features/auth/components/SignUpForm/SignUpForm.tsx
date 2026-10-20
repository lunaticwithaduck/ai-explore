'use client';

import { Button } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useEnsureProfileMutation } from '@/api/endpoints/profile';
import { useAppDispatch } from '@/api/hooks';
import { TEST_IDS } from '@/config/test-ids';
import { type SignUpValues, signUpSchema } from '../../config/schemas';
import { useAppLocale } from '../../hooks/useAppLocale';
import { userUpdated } from '../../state/authSlice';
import { signUpWithEmail } from '../../utils/authActions';
import { type AuthErrorKey, toAuthErrorKey } from '../../utils/authErrors';
import { AuthField } from '../AuthField/AuthField';

export type SignUpFormProps = {
  disabled?: boolean;
  onBusyChange: (busy: boolean) => void;
  onError: (error: AuthErrorKey | null) => void;
};

export function SignUpForm({ disabled = false, onBusyChange, onError }: SignUpFormProps) {
  const t = useTranslations('auth');
  const dispatch = useAppDispatch();
  const locale = useAppLocale();
  const [ensureProfile] = useEnsureProfileMutation();
  const { register, handleSubmit, formState } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });
  const fieldError = (message?: string) => (message ? t(message) : undefined);

  const onSubmit = handleSubmit(async (values) => {
    onError(null);
    onBusyChange(true);
    try {
      const user = await signUpWithEmail(values);
      dispatch(userUpdated({ displayName: values.displayName }));
      await ensureProfile({
        uid: user.uid,
        displayName: values.displayName,
        photoUrl: null,
        locale,
        overwriteDisplayName: true,
      });
    } catch (error) {
      onError(toAuthErrorKey(error));
    } finally {
      onBusyChange(false);
    }
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <AuthField
        id="sign-up-display-name"
        autoComplete="nickname"
        label={t('fields.displayName')}
        placeholder={t('fields.displayNamePlaceholder')}
        error={fieldError(formState.errors.displayName?.message)}
        data-testid={TEST_IDS.auth.displayName}
        {...register('displayName')}
      />
      <AuthField
        id="sign-up-email"
        type="email"
        autoComplete="email"
        label={t('fields.email')}
        placeholder={t('fields.emailPlaceholder')}
        error={fieldError(formState.errors.email?.message)}
        data-testid={TEST_IDS.auth.email}
        {...register('email')}
      />
      <AuthField
        id="sign-up-password"
        type="password"
        autoComplete="new-password"
        label={t('fields.password')}
        hint={t('fields.passwordHint')}
        error={fieldError(formState.errors.password?.message)}
        data-testid={TEST_IDS.auth.password}
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
        {t('signUp.submit')}
      </Button>
    </form>
  );
}
