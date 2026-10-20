import type { Bundle, Category, Tool, WithId } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';

export type LibraryViewProps = {
  tools: WithId<Tool>[];
  categories: WithId<Category>[];
  bundles: WithId<Bundle>[];
};

export function LibraryView(_props: LibraryViewProps) {
  const t = useTranslations('common');
  return (
    <main className="mx-auto max-w-content px-4 py-8">
      <Heading level={1}>{t('appName')}</Heading>
      <Text tone="muted">{t('tagline')}</Text>
    </main>
  );
}
