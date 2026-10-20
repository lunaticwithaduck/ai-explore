'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { Heading, Skeleton, Tabs, TabsContent, Text } from '@ai-explore/ui';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { CollectionHeader } from '../components/CollectionHeader/CollectionHeader';
import { LibraryPanel } from '../components/LibraryPanel/LibraryPanel';
import { LibraryTabs } from '../components/LibraryTabs/LibraryTabs';
import { COLLECTION_PARAM, SAVED_TAB } from '../config/constants';
import { useSavedTools } from '../hooks/useSavedTools';
import { useUserCollections } from '../hooks/useUserCollections';

export type MyLibraryViewProps = {
  tools: WithId<Tool>[];
};

export function MyLibraryView({ tools }: MyLibraryViewProps) {
  const t = useTranslations('myLibrary');
  const router = useRouter();
  const param = useSearchParams().get(COLLECTION_PARAM);
  const { uid, collections, loaded: collectionsLoaded } = useUserCollections();
  const { ids, loaded: savedLoaded } = useSavedTools();
  const toolsById = useMemo(() => new Map(tools.map((tool) => [tool.id, tool])), [tools]);

  const selected = collections.find((collection) => collection.id === param) ?? null;
  const value = selected?.id ?? SAVED_TAB;
  const pick = (toolIds: Iterable<string>) => [...toolIds].flatMap((id) => toolsById.get(id) ?? []);
  const ready = collectionsLoaded && savedLoaded;

  const select = (next: string) =>
    router.replace(next === SAVED_TAB ? routes.myLibrary : routes.myCollection(next), {
      scroll: false,
    });

  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-1">
        <Heading level={1}>{t('title')}</Heading>
        <Text tone="muted">{t('subtitle')}</Text>
      </header>
      {!ready || !uid ? (
        <Skeleton shape="card" className="h-48 w-full" />
      ) : (
        <Tabs value={value} onValueChange={select}>
          <LibraryTabs collections={collections} />
          <TabsContent value={SAVED_TAB} className="flex flex-col gap-4">
            <LibraryPanel tools={pick(ids)} kind="saved" />
          </TabsContent>
          {collections.map((collection) => (
            <TabsContent key={collection.id} value={collection.id} className="flex flex-col gap-4">
              <CollectionHeader
                uid={uid}
                collection={collection}
                toolCount={collection.toolIds.length}
                onDeleted={() => select(SAVED_TAB)}
              />
              <LibraryPanel tools={pick(collection.toolIds)} kind="collection" />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}
