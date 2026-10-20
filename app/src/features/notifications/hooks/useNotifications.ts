import { skipToken } from '@reduxjs/toolkit/query';
import {
  countNew,
  isNewUpdate,
  type NotificationItemData,
  useMarkNotificationsReadMutation,
  useNotificationFeedQuery,
  useNotificationSavedIdsQuery,
} from '@/api/endpoints/notifications';
import { useProfileQuery } from '@/api/endpoints/profile';

export type NotificationEntry = NotificationItemData & { isNew: boolean };

export function useNotifications(uid: string) {
  const profile = useProfileQuery(uid);
  const saved = useNotificationSavedIdsQuery(uid);
  const feed = useNotificationFeedQuery(saved.data ?? skipToken);
  const [markRead, markState] = useMarkNotificationsReadMutation();
  const seenAt = profile.data?.notificationsSeenAt ?? null;
  const ready = profile.data !== undefined;
  const items: NotificationEntry[] = (feed.data ?? []).map((item) => ({
    ...item,
    isNew: ready && isNewUpdate(item.update.publishedAt, seenAt),
  }));
  return {
    items,
    newCount: ready ? countNew(items, seenAt) : 0,
    isLoading: saved.isLoading || feed.isLoading || profile.isLoading,
    isFailed: saved.isError || feed.isError,
    markAllRead: () => markRead(uid),
    isMarking: markState.isLoading,
  };
}
