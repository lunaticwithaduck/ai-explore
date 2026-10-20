'use client';

import { Button } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { useAppLocale } from '../../hooks/useAppLocale';
import { signInWithGoogle } from '../../utils/authActions';
import { type AuthErrorKey, toAuthErrorKey } from '../../utils/authErrors';

export type GoogleButtonProps = {
  disabled?: boolean;
  onBusyChange: (busy: boolean) => void;
  onError: (error: AuthErrorKey | null) => void;
};

export function GoogleButton({ disabled = false, onBusyChange, onError }: GoogleButtonProps) {
  const t = useTranslations('auth');
  const locale = useAppLocale();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    onError(null);
    setPending(true);
    onBusyChange(true);
    try {
      await signInWithGoogle(locale);
    } catch (error) {
      onError(toAuthErrorKey(error));
    } finally {
      setPending(false);
      onBusyChange(false);
    }
  };

  return (
    <Button
      variant="secondary"
      fullWidth
      loading={pending}
      disabled={disabled}
      onClick={handleClick}
      data-testid={TEST_IDS.auth.google}
    >
      {t('google')}
    </Button>
  );
}
