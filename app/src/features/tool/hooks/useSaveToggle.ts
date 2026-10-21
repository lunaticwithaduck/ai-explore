import { useState } from 'react';
import { useSaveToLibraryMutation, useUnsaveFromLibraryMutation } from '@/api/endpoints/myLibrary';
import { useSavedTools } from '@/features/my-library/hooks/useSavedTools';
import { resultErrorCode } from '@/features/my-library/utils/resultError';

export type SaveToggle = {
  signedOut: boolean;
  ready: boolean;
  saved: boolean;
  errorCode: string | null;
  toggle: () => Promise<void>;
};

export function useSaveToggle(toolId: string): SaveToggle {
  const { uid, signedOut, loaded, ids } = useSavedTools();
  const [save] = useSaveToLibraryMutation();
  const [unsave] = useUnsaveFromLibraryMutation();
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const saved = ids.has(toolId);

  const toggle = async () => {
    if (!uid) return;
    setErrorCode(null);
    const result = await (saved ? unsave : save)({ uid, toolId });
    setErrorCode(resultErrorCode(result));
  };

  return { signedOut, ready: Boolean(uid) && loaded, saved, errorCode, toggle };
}
