'use client';

import { IconButton, Text } from '@ai-explore/ui';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSaveToLibraryMutation, useUnsaveFromLibraryMutation } from '@/api/endpoints/myLibrary';
import { TEST_IDS } from '@/config/test-ids';
import { signInHref } from '@/features/auth/utils/nextParam';
import { Link, usePathname } from '@/i18n/navigation';
import { useSavedTools } from '../../hooks/useSavedTools';
import { resultErrorCode } from '../../utils/resultError';
import { saveToolButtonStyles } from './SaveToolButton.styles';

export type SaveToolButtonProps = {
  toolId: string;
};

export function SaveToolButton({ toolId }: SaveToolButtonProps) {
  const t = useTranslations('myLibrary');
  const te = useTranslations('errors');
  const pathname = usePathname();
  const { uid, signedOut, loaded, ids } = useSavedTools();
  const [save] = useSaveToLibraryMutation();
  const [unsave] = useUnsaveFromLibraryMutation();
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const saved = ids.has(toolId);

  if (signedOut) {
    return (
      <IconButton
        asChild
        icon={Heart}
        label={t('saveButton')}
        data-testid={TEST_IDS.myLibrary.saveButton}
      >
        <Link href={signInHref(pathname)} />
      </IconButton>
    );
  }

  const toggle = async () => {
    if (!uid) return;
    setErrorCode(null);
    const result = await (saved ? unsave : save)({ uid, toolId });
    setErrorCode(resultErrorCode(result));
  };

  return (
    <>
      <IconButton
        icon={Heart}
        label={t('saveButton')}
        aria-pressed={saved}
        disabled={!uid || !loaded}
        onClick={toggle}
        data-testid={TEST_IDS.myLibrary.saveButton}
        className={saved ? saveToolButtonStyles.saved : undefined}
      />
      {errorCode && (
        <Text role="alert" className="sr-only">
          {te(errorCode)}
        </Text>
      )}
    </>
  );
}
