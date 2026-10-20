import { Separator, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';

export function AuthDivider() {
  const t = useTranslations('auth');
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <Text as="span" size="xs" tone="subtle" className="uppercase tracking-wider">
        {t('or')}
      </Text>
      <Separator className="flex-1" />
    </div>
  );
}
