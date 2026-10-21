'use client';

import {
  accentTextClass,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@ai-explore/ui';
import { FolderPlus, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  type CollectionDoc,
  useAddToCollectionMutation,
  useCreateCollectionMutation,
  useRemoveFromCollectionMutation,
} from '@/api/endpoints/myLibrary';
import { TEST_IDS } from '@/config/test-ids';
import { collectionIcon } from '../../config/constants';
import { useUserCollections } from '../../hooks/useUserCollections';
import { canAddTool, nextCollectionStyle } from '../../utils/collections';
import { resultErrorCode } from '../../utils/resultError';
import { CollectionNameDialog } from '../CollectionNameDialog/CollectionNameDialog';

export type AddToCollectionMenuProps = {
  toolId: string;
  className?: string | undefined;
};

export function AddToCollectionMenu({ toolId, className }: AddToCollectionMenuProps) {
  const t = useTranslations('myLibrary');
  const te = useTranslations('errors');
  const { uid, collections } = useUserCollections();
  const [add] = useAddToCollectionMutation();
  const [remove] = useRemoveFromCollectionMutation();
  const [create] = useCreateCollectionMutation();
  const [creating, setCreating] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  if (!uid) return null;

  const toggle = async (collection: CollectionDoc, member: boolean) => {
    setErrorCode(null);
    const run = member ? remove : add;
    const result = await run({ uid, collectionId: collection.id, toolId });
    setErrorCode(resultErrorCode(result));
  };

  const createWithTool = async (name: string) => {
    const order = collections.length;
    const result = await create({
      uid,
      name,
      ...nextCollectionStyle(order),
      toolIds: [toolId],
      order,
    });
    return resultErrorCode(result);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            iconLeft={FolderPlus}
            className={className}
            data-testid={TEST_IDS.myLibrary.addToCollection}
          >
            {t('addToCollection')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{t('collectionsLabel')}</DropdownMenuLabel>
          {collections.length === 0 && (
            <Text size="sm" tone="muted" className="px-2.5 py-1.5">
              {t('noCollections')}
            </Text>
          )}
          {collections.map((collection) => {
            const member = collection.toolIds.includes(toolId);
            return (
              <DropdownMenuCheckboxItem
                key={collection.id}
                checked={member}
                disabled={!canAddTool(collection.toolIds, toolId)}
                onCheckedChange={() => toggle(collection, member)}
                icon={collectionIcon(collection.icon)}
                iconClassName={cn(accentTextClass[collection.color])}
                data-testid={TEST_IDS.myLibrary.addToCollectionItem}
                data-id={collection.id}
              >
                {collection.name}
              </DropdownMenuCheckboxItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon={Plus}
            onSelect={() => setCreating(true)}
            data-testid={TEST_IDS.myLibrary.newCollection}
          >
            {t('newCollection')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {errorCode && (
        <Text role="alert" size="sm" tone="danger">
          {te(errorCode)}
        </Text>
      )}
      <CollectionNameDialog
        open={creating}
        onOpenChange={setCreating}
        title={t('newCollectionTitle')}
        submitLabel={t('create')}
        onSubmit={createWithTool}
        inputTestId={TEST_IDS.myLibrary.collectionNameInput}
        submitTestId={TEST_IDS.myLibrary.collectionCreate}
      />
    </>
  );
}
