'use client';

import { Button, Text } from '@ai-explore/ui';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { SettingRow } from '../SettingRow/SettingRow';

export type SessionSettingsProps = {
  email: string | null;
};

export function SessionSettings({ email }: SessionSettingsProps) {
  const t = useTranslations('account');
  const signOut = useSignOut();
  return (
    <SettingRow
      title={
        <Text size="sm" weight="medium" className="break-words">
          {email ? t('settings.session.signedInAs', { email }) : t('settings.session.signedIn')}
        </Text>
      }
      description={t('settings.session.description')}
    >
      <Button variant="secondary" iconLeft={LogOut} onClick={() => void signOut()}>
        {t('settings.session.signOut')}
      </Button>
    </SettingRow>
  );
}
