'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { Heading, Skeleton, Tabs, TabsContent } from '@ai-explore/ui';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { CollectionHeader } from '../components/CollectionHeader/CollectionHeader';
import { LibraryHeader } from '../components/LibraryHeader/LibraryHeader';
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
  const ready = collectionsLoaded && savedLoaded && uid !== null;

  const select = (next: string) =>
    router.replace(next === SAVED_TAB ? routes.myLibrary : routes.myCollection(next), {
      scroll: false,
    });

  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-6 sm:p-8">
      {!ready && param ? (
        <Skeleton shape="text" className="h-16 w-64 max-w-full" />
      ) : selected && uid ? (
        <CollectionHeader
          uid={uid}
          collection={selected}
          toolCount={selected.toolIds.length}
          onDeleted={() => select(SAVED_TAB)}
        />
      ) : (
        <LibraryHeader title={t('title')} subtitle={t('subtitle')} />
      )}
      {!ready ? (
        <Skeleton shape="card" className="h-48 w-full" />
      ) : (
        <>
          <Heading level={2} className="sr-only">
            {t('resultsTitle')}
          </Heading>
          <Tabs variant="pill" value={value} onValueChange={select} className="flex flex-col">
            <LibraryTabs collections={collections} />
            <TabsContent value={SAVED_TAB} className="mt-6">
              <LibraryPanel tools={pick(ids)} kind="saved" />
            </TabsContent>
            {collections.map((collection) => (
              <TabsContent key={collection.id} value={collection.id} className="mt-6">
                <LibraryPanel tools={pick(collection.toolIds)} kind="collection" />
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </main>
  );
}
