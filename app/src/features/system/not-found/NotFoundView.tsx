import { Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';

export function NotFoundView() {
  const t = useTranslations('system');
  return (
    <main className="mx-auto max-w-content px-4 py-16">
      <Heading level={1}>{t('notFoundTitle')}</Heading>
      <Text tone="muted">{t('notFoundBody')}</Text>
    </main>
  );
}
