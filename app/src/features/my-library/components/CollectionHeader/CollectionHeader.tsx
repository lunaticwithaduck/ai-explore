'use client';

import { Button } from '@ai-explore/ui';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  type CollectionDoc,
  useDeleteCollectionMutation,
  useRenameCollectionMutation,
} from '@/api/endpoints/myLibrary';
import { resultErrorCode } from '../../utils/resultError';
import { CollectionNameDialog } from '../CollectionNameDialog/CollectionNameDialog';
import { DeleteCollectionDialog } from '../DeleteCollectionDialog/DeleteCollectionDialog';
import { LibraryHeader } from '../LibraryHeader/LibraryHeader';

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
    <>
      <LibraryHeader
        title={collection.name}
        subtitle={t('collectionSubtitle', { count: toolCount })}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={Pencil}
              onClick={() => setRenaming(true)}
            >
              {t('rename')}
            </Button>
            <Button variant="danger" size="sm" iconLeft={Trash2} onClick={() => setDeleting(true)}>
              {t('delete')}
            </Button>
          </>
        }
      />
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
    </>
  );
}
