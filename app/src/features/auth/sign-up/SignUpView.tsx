'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { AuthAlert } from '../components/AuthAlert/AuthAlert';
import { AuthCard } from '../components/AuthCard/AuthCard';
import { AuthDivider } from '../components/AuthDivider/AuthDivider';
import { AuthFooterLink } from '../components/AuthFooterLink/AuthFooterLink';
import { AuthPage } from '../components/AuthPage/AuthPage';
import { GoogleButton } from '../components/GoogleButton/GoogleButton';
import { SignUpForm } from '../components/SignUpForm/SignUpForm';
import { useNextParam } from '../hooks/useNextParam';
import { useRedirectWhenSignedIn } from '../hooks/useRedirectWhenSignedIn';
import type { AuthErrorKey } from '../utils/authErrors';
import { signInHref } from '../utils/nextParam';

export type SignUpViewProps = Record<string, never>;

export function SignUpView(_props: SignUpViewProps) {
  const t = useTranslations('auth');
  const next = useNextParam();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthErrorKey | null>(null);
  useRedirectWhenSignedIn(busy);

  return (
    <AuthPage>
      <AuthCard
        title={t('signUp.title')}
        subtitle={t('signUp.subtitle')}
        footer={
          <AuthFooterLink
            prompt={t('signUp.haveAccount')}
            label={t('signUp.toSignIn')}
            href={signInHref(next)}
          />
        }
      >
        {error && <AuthAlert message={t(`errors.${error}`)} data-testid={TEST_IDS.auth.error} />}
        <GoogleButton disabled={busy} onBusyChange={setBusy} onError={setError} />
        <AuthDivider />
        <SignUpForm disabled={busy} onBusyChange={setBusy} onError={setError} />
      </AuthCard>
    </AuthPage>
  );
}
