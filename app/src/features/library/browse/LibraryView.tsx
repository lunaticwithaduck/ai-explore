import { Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';

export function LibraryView() {
  const t = useTranslations('common');
  return (
    <main className="mx-auto max-w-content px-4 py-8">
      <Heading level={1}>{t('appName')}</Heading>
      <Text tone="muted">{t('tagline')}</Text>
    </main>
  );
}
