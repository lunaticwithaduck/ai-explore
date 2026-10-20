import { COLLECTIONS } from '@ai-explore/schemas';
import { doc, getDoc } from 'firebase/firestore';
import { clientDb } from '@/lib/firebase/client';
import { firestoreApi } from '../firestoreApi';
import { firestoreCall } from '../firestoreCall';

const authApi = firestoreApi.injectEndpoints({
  endpoints: (build) => ({
    isAdmin: build.query<boolean, string>({
      queryFn: (uid) =>
        firestoreCall(async () =>
          (await getDoc(doc(clientDb(), COLLECTIONS.admins, uid))).exists(),
        ),
    }),
  }),
});

export const { useIsAdminQuery } = authApi;
