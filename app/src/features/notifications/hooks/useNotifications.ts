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
  const updatesOff = profile.data?.prefs.productUpdates === false;
  const feed = useNotificationFeedQuery(updatesOff ? skipToken : (saved.data ?? skipToken));
  const [markRead, markState] = useMarkNotificationsReadMutation();
  const seenAt = profile.data?.notificationsSeenAt ?? null;
  const ready = profile.data !== undefined;
  const items: NotificationEntry[] = (updatesOff ? [] : (feed.data ?? [])).map((item) => ({
    ...item,
    isNew: ready && isNewUpdate(item.update.publishedAt, seenAt),
  }));
  return {
    items,
    updatesOff,
    newCount: ready && !updatesOff ? countNew(items, seenAt) : 0,
    isLoading: profile.isLoading || (!updatesOff && (saved.isLoading || feed.isLoading)),
    isFailed: !updatesOff && (saved.isError || feed.isError),
    markAllRead: () => markRead(uid),
    isMarking: markState.isLoading,
  };
}
