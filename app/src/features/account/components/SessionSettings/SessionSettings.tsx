'use client';

import { Button, Text } from '@ai-explore/ui';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSignOut } from '@/features/auth/hooks/useSignOut';

export type SessionSettingsProps = {
  email: string | null;
};

export function SessionSettings({ email }: SessionSettingsProps) {
  const t = useTranslations('account');
  const signOut = useSignOut();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {email && (
        <Text size="sm" tone="muted">
          {t('settings.session.signedInAs', { email })}
        </Text>
      )}
      <Button variant="secondary" iconLeft={LogOut} onClick={() => void signOut()}>
        {t('settings.session.signOut')}
      </Button>
    </div>
  );
}
