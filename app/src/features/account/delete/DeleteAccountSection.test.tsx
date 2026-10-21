import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/api/store';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { authStateChanged } from '@/features/auth/state/authSlice';
import account from '@/messages/en/account.json';
import errors from '@/messages/en/errors.json';
import { DeleteAccountSection } from './DeleteAccountSection';
import { type DeleteAccountOptions, deleteAccount } from './utils/deleteAccount';
import { reauthenticateUser, reauthMethodOf } from './utils/reauth';

const firebaseUser = vi.hoisted(() => ({ uid: 'u1', email: 'ada@example.com' }));
const db = vi.hoisted(() => ({ name: 'db' }));
const calls = vi.hoisted(() => [] as string[]);
const replace = vi.hoisted(() => vi.fn(() => calls.push('replace')));
const signOut = vi.hoisted(() => vi.fn(async () => calls.push('signOut')));
const releaseHold = vi.hoisted(() => vi.fn());
const holdProfileCreation = vi.hoisted(() => vi.fn(() => releaseHold));

vi.mock('@/lib/firebase/client', () => ({
  clientAuth: () => ({ currentUser: firebaseUser }),
  clientDb: () => db,
}));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/features/auth/hooks/useSignOut', () => ({ useSignOut: () => signOut }));
vi.mock('@/features/auth/hooks/useEnsureProfile', () => ({ holdProfileCreation }));
vi.mock('./utils/deleteAccount', () => ({ deleteAccount: vi.fn() }));
vi.mock('./utils/reauth', () => ({ reauthMethodOf: vi.fn(), reauthenticateUser: vi.fn() }));

const me = { uid: 'u1', email: 'ada@example.com', displayName: 'Ada', photoUrl: null };
const emailLabel = account.delete.dialog.emailLabel.replace('{email}', me.email);
const { passwordLabel } = account.delete.dialog;

const renderSection = () => {
  const store = makeStore();
  store.dispatch(authStateChanged(me));
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={{ account, errors }}>
        <DeleteAccountSection />
      </NextIntlClientProvider>
    </Provider>,
  );
  return userEvent.setup();
};

const openAndConfirm = async (user: ReturnType<typeof userEvent.setup>, password = 'secret') => {
  await user.click(screen.getByTestId(TEST_IDS.account.deleteAccount));
  await user.type(screen.getByLabelText(emailLabel), 'ADA@example.com ');
  if (password) await user.type(screen.getByLabelText(passwordLabel), password);
  await user.click(screen.getByTestId(TEST_IDS.account.confirmDelete));
};

const deferred = () => {
  let resolve: () => void = () => {};
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

describe('DeleteAccountSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls.length = 0;
    vi.mocked(reauthMethodOf).mockReturnValue('password');
    vi.mocked(reauthenticateUser).mockImplementation(async () => {
      calls.push('reauth');
    });
    vi.mocked(deleteAccount).mockImplementation(async () => {
      calls.push('delete');
    });
  });

  it('needs the matching email and the password before it can confirm', async () => {
    const user = renderSection();
    await user.click(screen.getByTestId(TEST_IDS.account.deleteAccount));
    const confirm = screen.getByTestId(TEST_IDS.account.confirmDelete);
    await user.type(screen.getByLabelText(emailLabel), 'someone@else.com');
    expect(confirm).toBeDisabled();
    await user.clear(screen.getByLabelText(emailLabel));
    await user.type(screen.getByLabelText(emailLabel), me.email);
    expect(confirm).toBeDisabled();
    await user.type(screen.getByLabelText(passwordLabel), 'secret');
    expect(confirm).toBeEnabled();
  });

  it('reauthenticates before anything is deleted, then signs out to the library', async () => {
    const user = renderSection();
    await openAndConfirm(user);
    await waitFor(() => expect(replace).toHaveBeenCalledWith(routes.library));
    expect(calls).toEqual(['reauth', 'delete', 'signOut', 'replace']);
    expect(reauthenticateUser).toHaveBeenCalledWith(firebaseUser, 'secret');
    expect(deleteAccount).toHaveBeenCalledWith(expect.objectContaining({ db, user: firebaseUser }));
    expect(holdProfileCreation).toHaveBeenCalledWith('u1');
    expect(releaseHold).toHaveBeenCalledTimes(1);
  });

  it('deletes nothing when the password is wrong', async () => {
    vi.mocked(reauthenticateUser).mockRejectedValueOnce(
      Object.assign(new Error('bad'), { code: 'auth/invalid-credential' }),
    );
    const user = renderSection();
    await openAndConfirm(user, 'wrong');
    expect(await screen.findByRole('alert')).toHaveTextContent(account.delete.errors.wrongPassword);
    expect(deleteAccount).not.toHaveBeenCalled();
    expect(screen.getByTestId(TEST_IDS.account.confirmDelete)).toBeEnabled();
  });

  it('confirms a Google user with the popup on the confirm click', async () => {
    vi.mocked(reauthMethodOf).mockReturnValue('google');
    const user = renderSection();
    await user.click(screen.getByTestId(TEST_IDS.account.deleteAccount));
    expect(screen.queryByLabelText(passwordLabel)).not.toBeInTheDocument();
    expect(screen.getByText(account.delete.dialog.googleHint)).toBeInTheDocument();
    await user.type(screen.getByLabelText(emailLabel), me.email);
    await user.click(screen.getByTestId(TEST_IDS.account.confirmDelete));
    await waitFor(() => expect(replace).toHaveBeenCalled());
    expect(reauthenticateUser).toHaveBeenCalledWith(firebaseUser, null);
    expect(calls.slice(0, 2)).toEqual(['reauth', 'delete']);
  });

  it('cannot be dismissed while the reauth is pending and recovers afterwards', async () => {
    const gate = deferred();
    vi.mocked(reauthenticateUser).mockReturnValueOnce(gate.promise);
    const user = renderSection();
    await openAndConfirm(user);
    const dialog = screen.getByRole('dialog');
    await user.keyboard('{Escape}');
    await user.click(within(dialog).getByRole('button', { name: account.delete.dialog.close }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: account.delete.dialog.cancel }),
    ).toBeDisabled();
    gate.resolve();
    await waitFor(() => expect(replace).toHaveBeenCalledWith(routes.library));
  });

  it('shows progress while deleting', async () => {
    const gate = deferred();
    vi.mocked(deleteAccount).mockImplementation(({ onStep }: DeleteAccountOptions) => {
      onStep('reviews');
      onStep('library');
      return gate.promise;
    });
    const user = renderSection();
    await openAndConfirm(user);
    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(account.delete.steps.library);
    expect(status.querySelector('[data-id="reviews"]')).toHaveAttribute('data-status', 'done');
    expect(status.querySelector('[data-id="library"]')).toHaveAttribute('aria-current', 'step');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    gate.resolve();
    await waitFor(() => expect(replace).toHaveBeenCalled());
  });

  it('says the data is gone when only the sign-in is left, and resumes after the password', async () => {
    vi.mocked(deleteAccount).mockImplementation(async ({ onStep, reauthenticate }) => {
      onStep('account');
      await reauthenticate();
      calls.push('resumed');
    });
    const user = renderSection();
    await openAndConfirm(user);
    const dialog = await screen.findByRole('dialog', { name: account.delete.finish.title });
    expect(dialog).toHaveTextContent(account.delete.finish.description);
    await user.type(within(dialog).getByLabelText(passwordLabel), 'secret');
    await user.click(
      within(dialog).getByRole('button', { name: account.delete.finish.submitPassword }),
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith(routes.library));
    expect(calls).toEqual(['reauth', 'reauth', 'resumed', 'signOut', 'replace']);
  });

  it('keeps an alert after the sign-in prompt is cancelled and can finish from it', async () => {
    vi.mocked(deleteAccount).mockImplementationOnce(async ({ onStep, reauthenticate }) => {
      onStep('account');
      await reauthenticate();
    });
    const user = renderSection();
    await openAndConfirm(user);
    const dialog = await screen.findByRole('dialog', { name: account.delete.finish.title });
    await user.click(within(dialog).getByRole('button', { name: account.delete.dialog.cancel }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(account.delete.remains.title);
    expect(signOut).not.toHaveBeenCalled();
    expect(releaseHold).toHaveBeenCalledTimes(1);

    await user.click(within(alert).getByRole('button', { name: account.delete.remains.action }));
    const finish = await screen.findByRole('dialog', { name: account.delete.finish.title });
    await user.type(within(finish).getByLabelText(passwordLabel), 'secret');
    await user.click(
      within(finish).getByRole('button', { name: account.delete.finish.submitPassword }),
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith(routes.library));
    expect(deleteAccount).toHaveBeenCalledTimes(2);
  });

  it('lets the delete button open again after a cancel', async () => {
    const user = renderSection();
    await user.click(screen.getByTestId(TEST_IDS.account.deleteAccount));
    await user.click(screen.getByRole('button', { name: account.delete.dialog.cancel }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByTestId(TEST_IDS.account.deleteAccount));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(emailLabel)).toHaveValue('');
  });

  it('shows a translated error when a step fails and stays signed in', async () => {
    vi.mocked(deleteAccount).mockRejectedValue(
      Object.assign(new Error('denied'), { code: 'permission-denied' }),
    );
    const user = renderSection();
    await openAndConfirm(user);
    expect(await screen.findByRole('alert')).toHaveTextContent(errors['permission-denied']);
    expect(signOut).not.toHaveBeenCalled();
    expect(releaseHold).toHaveBeenCalledTimes(1);
  });
});
