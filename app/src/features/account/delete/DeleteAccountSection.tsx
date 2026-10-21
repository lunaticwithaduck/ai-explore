'use client';

import { Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { SettingRow } from '../components/SettingRow/SettingRow';
import { DeleteAccountDialog } from './components/DeleteAccountDialog/DeleteAccountDialog';
import { SignInRemainsAlert } from './components/SignInRemainsAlert/SignInRemainsAlert';
import { deleteAccountSectionStyles as styles } from './DeleteAccountSection.styles';
import { useDeleteAccount } from './hooks/useDeleteAccount';

export function DeleteAccountSection() {
  const t = useTranslations('account');
  const { user } = useCurrentUser();
  const deletion = useDeleteAccount();
  const [open, setOpen] = useState(false);

  const finishSignIn = () => {
    deletion.resumeSignInDelete();
    setOpen(true);
  };

  return (
    <div className={styles.root}>
      {deletion.signInRemains && <SignInRemainsAlert onFinish={finishSignIn} />}
      <SettingRow
        title={
          <Text size="sm" weight="medium">
            {t('delete.title')}
          </Text>
        }
        description={t('delete.description')}
      >
        <DeleteAccountDialog
          email={user?.email ?? ''}
          open={open}
          onOpenChange={setOpen}
          deletion={deletion}
        />
      </SettingRow>
    </div>
  );
}
