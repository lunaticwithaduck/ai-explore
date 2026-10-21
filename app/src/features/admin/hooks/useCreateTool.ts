import { type DocumentData, serverTimestamp } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { type AppError, toAppError } from '@/api/errors';
import { firestoreApi } from '@/api/firestoreApi';
import { useAppDispatch } from '@/api/hooks';
import { routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { createToolOnce, toolExistsOnServer } from '../utils/createOnce';

let createdSlug: string | null = null;

export function useJustCreated(slug: string | undefined): boolean {
  const [justCreated] = useState(() => {
    const matched = slug !== undefined && createdSlug === slug;
    if (matched) createdSlug = null;
    return matched;
  });
  return justCreated;
}

export type CreateToolOutcome = 'created' | 'taken' | 'failed';

export function useCreateTool() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<AppError | null>(null);
  const create = useCallback(
    async (
      slug: string,
      build: (stamp: ReturnType<typeof serverTimestamp>) => DocumentData,
    ): Promise<CreateToolOutcome> => {
      setError(null);
      try {
        if (await toolExistsOnServer(slug)) return 'taken';
        await createToolOnce(slug, build(serverTimestamp()));
      } catch (cause) {
        const appError = toAppError(cause);
        if (appError.code === 'already-exists') return 'taken';
        setError(appError);
        return 'failed';
      }
      createdSlug = slug;
      dispatch(firestoreApi.util.invalidateTags(['AdminTool']));
      router.replace(routes.adminTool(slug));
      return 'created';
    },
    [dispatch, router],
  );
  return { create, error };
}
