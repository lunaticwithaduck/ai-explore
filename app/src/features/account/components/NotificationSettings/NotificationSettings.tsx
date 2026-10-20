'use client';

import type { UserProfile } from '@ai-explore/schemas';
import { Badge, Label, Switch, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useUpdateProfileMutation } from '@/api/endpoints/profile';
import { NOTIFICATION_PREFS, type NotificationPref } from '../../config/constants';

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
    <ul className="flex flex-col divide-y divide-border">
      {NOTIFICATION_PREFS.map((pref) => (
        <li
          key={pref}
          data-id={pref}
          className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Label htmlFor={`settings-pref-${pref}`}>
                {t(`settings.notifications.${pref}.label`)}
              </Label>
              {pref === 'emailDigest' && (
                <Badge tone="outline">{t('settings.notifications.comingSoon')}</Badge>
              )}
            </div>
            <Text size="sm" tone="muted">
              {t(`settings.notifications.${pref}.description`)}
            </Text>
          </div>
          <Switch
            id={`settings-pref-${pref}`}
            checked={prefs[pref]}
            disabled={isLoading}
            onCheckedChange={(checked) => toggle(pref, checked)}
          />
        </li>
      ))}
    </ul>
  );
}
