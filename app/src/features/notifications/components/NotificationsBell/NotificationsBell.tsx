'use client';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { NotificationsMenu } from '../NotificationsMenu/NotificationsMenu';

export type NotificationsBellProps = Record<string, never>;

export function NotificationsBell(_props: NotificationsBellProps) {
  const { status, user } = useCurrentUser();
  if (status !== 'signedIn' || !user) return null;
  return <NotificationsMenu uid={user.uid} />;
}
