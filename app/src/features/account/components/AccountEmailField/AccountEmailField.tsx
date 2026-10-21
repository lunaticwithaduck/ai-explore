import { Input, Label, Text } from '@ai-explore/ui';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type AccountEmailFieldProps = {
  email: string;
};

export function AccountEmailField({ email }: AccountEmailFieldProps) {
  const t = useTranslations('account');
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="settings-email">{t('settings.email.label')}</Label>
      <div className="relative">
        <Mail
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-field-placeholder"
        />
        <Input
          id="settings-email"
          type="email"
          value={email}
          readOnly
          aria-describedby="settings-email-hint"
          className="pl-10"
        />
      </div>
      <Text id="settings-email-hint" size="xs" tone="muted">
        {t('settings.email.hint')}
      </Text>
    </div>
  );
}
