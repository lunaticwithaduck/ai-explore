'use client';

import { accentSubtleClass, Button, cn, Heading, Text } from '@ai-explore/ui';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  type CollectionDoc,
  useDeleteCollectionMutation,
  useRenameCollectionMutation,
} from '@/api/endpoints/myLibrary';
import { collectionIcon } from '../../config/constants';
import { resultErrorCode } from '../../utils/resultError';
import { CollectionNameDialog } from '../CollectionNameDialog/CollectionNameDialog';
import { DeleteCollectionDialog } from '../DeleteCollectionDialog/DeleteCollectionDialog';

export type CollectionHeaderProps = {
  uid: string;
  collection: CollectionDoc;
  toolCount: number;
  onDeleted: () => void;
};

export function CollectionHeader({ uid, collection, toolCount, onDeleted }: CollectionHeaderProps) {
  const t = useTranslations('myLibrary');
  const [rename] = useRenameCollectionMutation();
  const [remove] = useDeleteCollectionMutation();
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const Icon = collectionIcon(collection.icon);

  const submitRename = async (name: string) => {
    const result = await rename({ uid, collectionId: collection.id, name });
    return resultErrorCode(result);
  };

  const confirmDelete = async () => {
    setDeleteError(null);
    const result = await remove({ uid, collectionId: collection.id });
    const code = resultErrorCode(result);
    setDeleteError(code);
    if (!code) {
      setDeleting(false);
      onDeleted();
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-button',
            accentSubtleClass[collection.color],
          )}
        >
          <Icon aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <Heading level={2} size="md" className="break-words">
            {collection.name}
          </Heading>
          <Text size="sm" tone="subtle">
            {t('toolCount', { count: toolCount })}
          </Text>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" iconLeft={Pencil} onClick={() => setRenaming(true)}>
          {t('rename')}
        </Button>
        <Button variant="danger" size="sm" iconLeft={Trash2} onClick={() => setDeleting(true)}>
          {t('delete')}
        </Button>
      </div>
      <CollectionNameDialog
        open={renaming}
        onOpenChange={setRenaming}
        title={t('renameTitle')}
        submitLabel={t('save')}
        initialName={collection.name}
        onSubmit={submitRename}
      />
      <DeleteCollectionDialog
        open={deleting}
        onOpenChange={setDeleting}
        name={collection.name}
        errorCode={deleteError}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
