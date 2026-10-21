'use client';

import { IconButton } from '@ai-explore/ui';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCreateCollectionMutation } from '@/api/endpoints/myLibrary';
import { TEST_IDS } from '@/config/test-ids';
import { useUserCollections } from '../../hooks/useUserCollections';
import { nextCollectionStyle } from '../../utils/collections';
import { resultErrorCode } from '../../utils/resultError';
import { CollectionNameDialog } from '../CollectionNameDialog/CollectionNameDialog';

export type NewCollectionButtonProps = Record<string, never>;

export function NewCollectionButton(_props: NewCollectionButtonProps) {
  const t = useTranslations('myLibrary');
  const { uid, collections } = useUserCollections();
  const [create] = useCreateCollectionMutation();
  const [open, setOpen] = useState(false);
  if (!uid) return null;

  const createEmpty = async (name: string) => {
    const order = collections.length;
    const result = await create({ uid, name, ...nextCollectionStyle(order), toolIds: [], order });
    return resultErrorCode(result);
  };

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        icon={Plus}
        label={t('newCollection')}
        onClick={() => setOpen(true)}
        className="h-6 w-6 text-text"
        data-testid={TEST_IDS.shell.sidebarNewCollection}
      />
      <CollectionNameDialog
        open={open}
        onOpenChange={setOpen}
        title={t('newCollectionTitle')}
        submitLabel={t('create')}
        onSubmit={createEmpty}
        inputTestId={TEST_IDS.myLibrary.collectionNameInput}
        submitTestId={TEST_IDS.myLibrary.collectionCreate}
      />
    </>
  );
}
