import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/api/store';
import { TEST_IDS } from '@/config/test-ids';
import auth from '@/messages/en/auth.json';
import { authStateChanged } from '../state/authSlice';
import { signInWithEmail } from '../utils/authActions';
import { SignInView } from './SignInView';

const router = { replace: vi.fn(), push: vi.fn() };
let search = '';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  useRouter: () => router,
  usePathname: () => '/sign-in',
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(search),
}));

vi.mock('../utils/authActions', () => ({
  signInWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

const renderView = () => {
  const store = makeStore();
  store.dispatch(authStateChanged(null));
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={{ auth }}>
        <SignInView />
      </NextIntlClientProvider>
    </Provider>,
  );
  return store;
};

const fillAndSubmit = async (email: string, password: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByTestId(TEST_IDS.auth.email), email);
  await user.type(screen.getByTestId(TEST_IDS.auth.password), password);
  await user.click(screen.getByTestId(TEST_IDS.auth.submit));
};

describe('SignInView', () => {
  beforeEach(() => {
    vi.mocked(signInWithEmail).mockReset();
    router.replace.mockReset();
    search = '';
  });

  it('shows translated validation errors and does not call Firebase', async () => {
    renderView();
    await userEvent.setup().click(screen.getByTestId(TEST_IDS.auth.submit));
    expect(await screen.findByText(auth.validation.emailInvalid)).toBeInTheDocument();
    expect(screen.getByText(auth.validation.passwordRequired)).toBeInTheDocument();
    expect(signInWithEmail).not.toHaveBeenCalled();
  });

  it('maps a Firebase auth code to auth.errors copy, never the raw message', async () => {
    vi.mocked(signInWithEmail).mockRejectedValue(
      Object.assign(new Error('Firebase: Error (auth/invalid-credential).'), {
        code: 'auth/invalid-credential',
      }),
    );
    renderView();
    await fillAndSubmit('ada@example.com', 'wrong-password');
    const alert = await screen.findByTestId(TEST_IDS.auth.error);
    expect(alert).toHaveTextContent(auth.errors.invalidCredential);
    expect(alert).not.toHaveTextContent('Firebase');
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('redirects to a safe ?next= once signed in', async () => {
    search = 'next=%2Ftools%2Fclaude';
    const store = renderView();
    vi.mocked(signInWithEmail).mockImplementation(async () => {
      const user = { uid: 'u1', email: 'ada@example.com', displayName: 'Ada', photoUrl: null };
      store.dispatch(authStateChanged(user));
      return user;
    });
    await fillAndSubmit('ada@example.com', 'secret-123');
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/tools/claude'));
  });

  it('ignores an off-site ?next= and falls back to the library', async () => {
    search = 'next=https%3A%2F%2Fevil.example';
    const store = renderView();
    vi.mocked(signInWithEmail).mockImplementation(async () => {
      const user = { uid: 'u1', email: 'ada@example.com', displayName: 'Ada', photoUrl: null };
      store.dispatch(authStateChanged(user));
      return user;
    });
    await fillAndSubmit('ada@example.com', 'secret-123');
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/'));
  });
});
