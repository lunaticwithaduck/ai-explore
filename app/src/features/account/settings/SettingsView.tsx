'use client';

import { Heading, Skeleton } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useCurrentProfile } from '@/features/auth/hooks/useCurrentProfile';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { AccountBackButton } from '../components/AccountBackButton/AccountBackButton';
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
    <main className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8 sm:px-6">
      <AccountBackButton />
      <Heading level={1}>{t('settings.title')}</Heading>
      {(!user || profile === undefined) && <Skeleton shape="card" className="h-64" />}
      {user && profile && (
        <>
          <AccountSection
            headingId="settings-profile-heading"
            title={t('settings.displayName.title')}
          >
            <DisplayNameForm uid={user.uid} displayName={profile.displayName} />
          </AccountSection>
          <AccountSection
            headingId="settings-language-heading"
            title={t('settings.locale.title')}
            description={t('settings.locale.description')}
          >
            <LocaleSetting />
          </AccountSection>
          <AccountSection
            headingId="settings-notifications-heading"
            title={t('settings.notifications.title')}
          >
            <NotificationSettings uid={user.uid} prefs={profile.prefs} />
          </AccountSection>
        </>
      )}
      {user && profile !== undefined && (
        <>
          <AccountSection headingId="settings-session-heading" title={t('settings.session.title')}>
            <SessionSettings email={user.email} />
          </AccountSection>
          <AccountSection
            headingId="settings-danger-heading"
            tone="danger"
            title={t('settings.danger.title')}
            description={t('settings.danger.description')}
          >
            <DeleteAccountSection />
          </AccountSection>
        </>
      )}
    </main>
  );
}
