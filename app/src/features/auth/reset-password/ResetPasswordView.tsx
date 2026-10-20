'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { AuthAlert } from '../components/AuthAlert/AuthAlert';
import { AuthCard } from '../components/AuthCard/AuthCard';
import { AuthFooterLink } from '../components/AuthFooterLink/AuthFooterLink';
import { AuthPage } from '../components/AuthPage/AuthPage';
import { ResetPasswordForm } from '../components/ResetPasswordForm/ResetPasswordForm';
import type { AuthErrorKey } from '../utils/authErrors';

export type ResetPasswordViewProps = Record<string, never>;

export function ResetPasswordView(_props: ResetPasswordViewProps) {
  const t = useTranslations('auth');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<AuthErrorKey | null>(null);

  return (
    <AuthPage>
      <AuthCard
        title={t('reset.title')}
        subtitle={t('reset.subtitle')}
        footer={
          <AuthFooterLink
            prompt={t('reset.rememberPassword')}
            label={t('reset.toSignIn')}
            href={routes.signIn}
          />
        }
      >
        {error && <AuthAlert message={t(`errors.${error}`)} data-testid={TEST_IDS.auth.error} />}
        {sentTo ? (
          <AuthAlert tone="success" message={t('reset.sent', { email: sentTo })} />
        ) : (
          <ResetPasswordForm onSent={setSentTo} onError={setError} />
        )}
      </AuthCard>
    </AuthPage>
  );
}
