import { updateProfile } from 'firebase/auth';
import { clientAuth } from '@/lib/firebase/client';

export async function updateAuthDisplayName(displayName: string): Promise<void> {
  const user = clientAuth().currentUser;
  if (user) await updateProfile(user, { displayName });
}
