import type { Tool, WithId } from '@ai-explore/schemas';
import { Button, Heading, Text } from '@ai-explore/ui';
import { FolderOpen, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { ToolCard } from '@/features/catalogue/components/ToolCard/ToolCard';
import { Link } from '@/i18n/navigation';
import { SaveToolButton } from '../SaveToolButton/SaveToolButton';

export type LibraryPanelProps = {
  tools: WithId<Tool>[];
  kind: 'saved' | 'collection';
};

export function LibraryPanel({ tools, kind }: LibraryPanelProps) {
  const t = useTranslations('myLibrary');
  if (tools.length === 0) {
    const Icon = kind === 'saved' ? Heart : FolderOpen;
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <Icon aria-hidden className="mb-1 size-12 text-text-muted opacity-50" />
        <Heading level={3} size="md">
          {t(kind === 'saved' ? 'emptySavedTitle' : 'emptyCollectionTitle')}
        </Heading>
        <Text tone="muted">{t(kind === 'saved' ? 'emptySavedBody' : 'emptyCollectionBody')}</Text>
        <Button asChild className="mt-1">
          <Link href={routes.library}>{t('browse')}</Link>
        </Button>
      </div>
    );
  }
  return (
    <div
      data-testid={TEST_IDS.myLibrary.grid}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} actions={<SaveToolButton toolId={tool.id} />} />
      ))}
    </div>
  );
}
