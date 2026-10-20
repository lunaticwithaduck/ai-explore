'use client';

import { Select } from '@ai-explore/ui';
import { hasLocale, useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { useAppLocale } from '@/features/auth/hooks/useAppLocale';
import { useLocaleSwitch } from '@/features/auth/hooks/useLocaleSwitch';
import { routing } from '@/i18n/routing';

export type LocaleSwitcherProps = {
  id?: string;
  className?: string;
};

export function LocaleSwitcher({ id, className }: LocaleSwitcherProps) {
  const t = useTranslations('shell');
  const locale = useAppLocale();
  const switchLocale = useLocaleSwitch();
  const options = routing.locales.map((value) => ({
    value,
    label: t(`locale.${value}`),
    testId: TEST_IDS.shell.localeOption,
  }));

  return (
    <Select
      id={id}
      size="sm"
      value={locale}
      options={options}
      onValueChange={(value) => {
        if (hasLocale(routing.locales, value)) switchLocale(value);
      }}
      aria-label={t('locale.label')}
      data-testid={TEST_IDS.shell.localeSwitcher}
      className={className}
    />
  );
}
