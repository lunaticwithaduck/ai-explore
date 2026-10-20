import { act, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/api/store';
import { authStateChanged } from '@/features/auth/state/authSlice';
import shell from '@/messages/en/shell.json';
import { AuthGate } from './AuthGate';

const router = { replace: vi.fn() };

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/library',
}));

const user = { uid: 'u1', email: 'ada@example.com', displayName: 'Ada', photoUrl: null };

const renderGate = () => {
  const store = makeStore();
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={{ shell }}>
        <AuthGate>
          <span>private</span>
        </AuthGate>
      </NextIntlClientProvider>
    </Provider>,
  );
  return store;
};

describe('AuthGate', () => {
  beforeEach(() => {
    router.replace.mockReset();
    window.history.replaceState({}, '', '/library?collection=c1');
  });

  it('shows a skeleton while the auth state is loading', () => {
    renderGate();
    expect(screen.getByRole('status')).toHaveTextContent(shell.gate.loading);
    expect(screen.queryByText('private')).not.toBeInTheDocument();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('sends a signed-out visitor to sign-in with the current path as next', () => {
    const store = renderGate();
    act(() => {
      store.dispatch(authStateChanged(null));
    });
    expect(router.replace).toHaveBeenCalledWith(
      `/sign-in?next=${encodeURIComponent('/library?collection=c1')}`,
    );
  });

  it('renders the children when signed in', () => {
    const store = renderGate();
    act(() => {
      store.dispatch(authStateChanged(user));
    });
    expect(screen.getByText('private')).toBeInTheDocument();
  });

  it('goes to the library, not sign-in, after an explicit sign-out', () => {
    const store = renderGate();
    act(() => {
      store.dispatch(authStateChanged(user));
    });
    act(() => {
      store.dispatch(authStateChanged(null));
    });
    expect(router.replace).toHaveBeenCalledWith('/');
  });
});
