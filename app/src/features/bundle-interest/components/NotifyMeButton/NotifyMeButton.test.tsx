import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import messages from '../../../../messages/en/bundleInterest.json';
import errors from '../../../../messages/en/errors.json';
import { NotifyMeButton } from './NotifyMeButton';

const register = vi.fn();
const state = {
  auth: { status: 'signedIn', user: { uid: 'u1' } } as { status: string; user: unknown },
  interest: { currentData: null, isError: false } as { currentData: unknown; isError: boolean },
};

vi.mock('@/features/auth/hooks/useCurrentUser', () => ({ useCurrentUser: () => state.auth }));
vi.mock('@/api/endpoints/bundleInterest', () => ({
  useBundleInterestQuery: () => state.interest,
  useRegisterInterestMutation: () => [register, { isLoading: false, error: undefined }],
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...rest }: { children?: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const renderButton = () =>
  render(
    <NextIntlClientProvider locale="en" messages={{ bundleInterest: messages, errors }}>
      <NotifyMeButton bundleId="pack" period="yearly" />
    </NextIntlClientProvider>,
  );

describe('NotifyMeButton', () => {
  beforeEach(() => {
    register.mockReset();
    state.auth = { status: 'signedIn', user: { uid: 'u1' } };
    state.interest = { currentData: null, isError: false };
  });

  it('links signed-out visitors to sign-in with next', () => {
    state.auth = { status: 'signedOut', user: null };
    renderButton();
    expect(screen.getByTestId('bundle-interest-notify-me').getAttribute('href')).toBe(
      '/sign-in?next=%2Fbundles%2Fpack',
    );
  });

  it('registers the chosen period once', () => {
    renderButton();
    fireEvent.click(screen.getByTestId('bundle-interest-notify-me'));
    expect(register).toHaveBeenCalledWith({ uid: 'u1', bundleId: 'pack', period: 'yearly' });
  });

  it('shows registered and no active notify button when the doc exists', () => {
    state.interest = { currentData: { period: 'monthly' }, isError: false };
    renderButton();
    expect(screen.getByTestId('bundle-interest-registered')).toBeTruthy();
    expect(screen.queryByTestId('bundle-interest-notify-me')).toBeNull();
  });
});
