'use client';

import type { UserProfile } from '@ai-explore/schemas';
import { Badge, Label, Switch } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useUpdateProfileMutation } from '@/api/endpoints/profile';
import { NOTIFICATION_PREFS, type NotificationPref } from '../../config/constants';
import { SettingRow } from '../SettingRow/SettingRow';

export type NotificationSettingsProps = {
  uid: string;
  prefs: UserProfile['prefs'];
};

export function NotificationSettings({ uid, prefs }: NotificationSettingsProps) {
  const t = useTranslations('account');
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const toggle = (pref: NotificationPref, checked: boolean) =>
    updateProfile({ uid, patch: { prefs: { ...prefs, [pref]: checked } } });
  return (
    <ul className="flex flex-col gap-4">
      {NOTIFICATION_PREFS.map((pref) => (
        <SettingRow
          key={pref}
          as="li"
          data-id={pref}
          title={
            <>
              <Label htmlFor={`settings-pref-${pref}`}>
                {t(`settings.notifications.${pref}.label`)}
              </Label>
              {pref === 'emailDigest' && (
                <Badge tone="outline">{t('settings.notifications.comingSoon')}</Badge>
              )}
            </>
          }
          description={t(`settings.notifications.${pref}.description`)}
        >
          <Switch
            id={`settings-pref-${pref}`}
            checked={prefs[pref]}
            disabled={isLoading}
            onCheckedChange={(checked) => toggle(pref, checked)}
          />
        </SettingRow>
      ))}
    </ul>
  );
}
