'use client';

import { accentTextClass, Button, cn } from '@ai-explore/ui';
import { useSearchParams } from 'next/navigation';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link, usePathname } from '@/i18n/navigation';
import { COLLECTION_PARAM, collectionIcon } from '../../config/constants';
import { useUserCollections } from '../../hooks/useUserCollections';
import { sidebarCollectionStyles } from './SidebarCollections.styles';

export type SidebarCollectionsProps = Record<string, never>;

export function SidebarCollections(_props: SidebarCollectionsProps) {
  const { uid, collections } = useUserCollections();
  const pathname = usePathname();
  const activeId = useSearchParams().get(COLLECTION_PARAM);
  if (!uid) return null;

  return (
    <>
      {collections.map((collection) => {
        const Icon = collectionIcon(collection.icon);
        const active = pathname === routes.myLibrary && activeId === collection.id;
        return (
          <Button
            key={collection.id}
            asChild
            variant="ghost"
            fullWidth
            className={cn(sidebarCollectionStyles.base, active && sidebarCollectionStyles.active)}
          >
            <Link
              href={routes.myCollection(collection.id)}
              aria-current={active ? 'page' : undefined}
              data-testid={TEST_IDS.shell.sidebarCollection}
              data-id={collection.id}
            >
              <Icon
                aria-hidden
                className={cn(sidebarCollectionStyles.icon, accentTextClass[collection.color])}
              />
              <span className={sidebarCollectionStyles.label}>{collection.name}</span>
              <span className={sidebarCollectionStyles.count}>{collection.toolIds.length}</span>
            </Link>
          </Button>
        );
      })}
    </>
  );
}
