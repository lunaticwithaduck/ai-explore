import { TabsList, TabsTrigger } from '@ai-explore/ui';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CollectionDoc } from '@/api/endpoints/myLibrary';
import { collectionIcon, SAVED_TAB } from '../../config/constants';

export type LibraryTabsProps = {
  collections: CollectionDoc[];
};

export function LibraryTabs({ collections }: LibraryTabsProps) {
  const t = useTranslations('myLibrary');
  return (
    <TabsList aria-label={t('tabsLabel')} className="max-w-full self-start overflow-x-auto">
      <TabsTrigger value={SAVED_TAB} icon={Heart} data-id={SAVED_TAB}>
        {t('savedTab')}
      </TabsTrigger>
      {collections.map((collection) => (
        <TabsTrigger
          key={collection.id}
          value={collection.id}
          icon={collectionIcon(collection.icon)}
          data-id={collection.id}
        >
          {collection.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
