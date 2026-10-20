import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '../../../../messages/en/notifications.json';
import { NotificationsBell } from './NotificationsBell';

const auth = vi.hoisted(() => ({ value: { status: 'signedOut', user: null } as unknown }));
const feed = vi.hoisted(() => ({ newCount: 0 }));

vi.mock('@/features/auth/hooks/useCurrentUser', () => ({ useCurrentUser: () => auth.value }));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children?: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('../../hooks/useNotifications', () => ({
  useNotifications: () => ({
    items: [],
    newCount: feed.newCount,
    isLoading: false,
    isFailed: false,
    isMarking: false,
    markAllRead: vi.fn(),
  }),
}));

const renderBell = () =>
  render(
    <NextIntlClientProvider locale="en" messages={{ notifications: messages }}>
      <NotificationsBell />
    </NextIntlClientProvider>,
  );

describe('NotificationsBell', () => {
  beforeEach(() => {
    feed.newCount = 0;
  });

  it('renders nothing when signed out', () => {
    auth.value = { status: 'signedOut', user: null };
    renderBell();
    expect(screen.queryByTestId('notifications-bell')).toBeNull();
  });

  it('omits the badge at zero and shows the count otherwise', () => {
    auth.value = { status: 'signedIn', user: { uid: 'u1' } };
    const { unmount } = renderBell();
    expect(screen.getByTestId('notifications-bell')).toBeInTheDocument();
    expect(screen.queryByTestId('notifications-badge')).toBeNull();
    unmount();
    feed.newCount = 3;
    renderBell();
    expect(screen.getByTestId('notifications-badge')).toHaveTextContent('3');
  });
});
