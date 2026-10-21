'use client';

import { Card, Heading, Skeleton, Text } from '@ai-explore/ui';
import { Bell, Globe, LogOut, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrentProfile } from '@/features/auth/hooks/useCurrentProfile';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AccountBackButton } from '../components/AccountBackButton/AccountBackButton';
import { AccountPage } from '../components/AccountPage/AccountPage';
import { AccountSection } from '../components/AccountSection/AccountSection';
import { DisplayNameForm } from '../components/DisplayNameForm/DisplayNameForm';
import { LocaleSetting } from '../components/LocaleSetting/LocaleSetting';
import { NotificationSettings } from '../components/NotificationSettings/NotificationSettings';
import { SessionSettings } from '../components/SessionSettings/SessionSettings';
import { DeleteAccountSection } from '../delete/DeleteAccountSection';

export type SettingsViewProps = Record<string, never>;

export function SettingsView(_props: SettingsViewProps) {
  const t = useTranslations('account');
  const { user } = useCurrentUser();
  const { profile } = useCurrentProfile();
  return (
    <AccountPage
      tone="settings"
      width="narrow"
      back={<AccountBackButton label={t('backButton')} />}
    >
      <Card padding="none" className="flex flex-col gap-2 p-5 sm:p-8">
        <Heading level={1}>{t('settings.title')}</Heading>
        <Text tone="muted">{t('settings.subtitle')}</Text>
      </Card>
      {(!user || profile === undefined) && <Skeleton shape="card" className="h-64" />}
      {user && profile && (
        <>
          <AccountSection
            headingId="settings-profile-heading"
            icon={UserRound}
            title={t('settings.account.title')}
          >
            <DisplayNameForm uid={user.uid} displayName={profile.displayName} email={user.email} />
          </AccountSection>
          <AccountSection
            headingId="settings-language-heading"
            icon={Globe}
            title={t('settings.locale.title')}
          >
            <LocaleSetting />
          </AccountSection>
          <AccountSection
            headingId="settings-notifications-heading"
            icon={Bell}
            title={t('settings.notifications.title')}
          >
            <NotificationSettings uid={user.uid} prefs={profile.prefs} />
          </AccountSection>
        </>
      )}
      {user && profile !== undefined && (
        <>
          <AccountSection
            headingId="settings-session-heading"
            icon={LogOut}
            title={t('settings.session.title')}
          >
            <SessionSettings email={user.email} />
          </AccountSection>
          <AccountSection
            headingId="settings-danger-heading"
            tone="danger"
            title={t('settings.danger.title')}
          >
            <DeleteAccountSection />
          </AccountSection>
        </>
      )}
    </AccountPage>
  );
}
