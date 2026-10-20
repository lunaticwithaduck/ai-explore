'use client';

import { Label, Select } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useAppLocale } from '@/features/auth/hooks/useAppLocale';
import { useLocaleSwitch } from '@/features/auth/hooks/useLocaleSwitch';
import { toAppLocale } from '@/features/auth/utils/appLocale';
import { routing } from '@/i18n/routing';

export function LocaleSetting() {
  const t = useTranslations('account');
  const locale = useAppLocale();
  const switchLocale = useLocaleSwitch();
  const options = routing.locales.map((value) => ({
    value,
    label: t(`settings.locale.options.${value}`),
  }));
  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="settings-locale">{t('settings.locale.label')}</Label>
      <Select
        id="settings-locale"
        options={options}
        value={locale}
        onValueChange={(value) => switchLocale(toAppLocale(value))}
      />
    </div>
  );
}
