import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/api/store';
import { TEST_IDS } from '@/config/test-ids';
import account from '@/messages/en/account.json';
import errors from '@/messages/en/errors.json';
import { updateAuthDisplayName } from '../../utils/accountActions';
import { DisplayNameForm } from './DisplayNameForm';

const updateProfile = vi.fn();

vi.mock('@/api/endpoints/profile', () => ({
  useUpdateProfileMutation: () => [updateProfile],
}));

vi.mock('../../utils/accountActions', () => ({
  updateAuthDisplayName: vi.fn(),
}));

const renderForm = () =>
  render(
    <Provider store={makeStore()}>
      <NextIntlClientProvider locale="en" messages={{ account, errors }}>
        <DisplayNameForm uid="u1" displayName="Ada" />
      </NextIntlClientProvider>
    </Provider>,
  );

describe('DisplayNameForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateProfile.mockResolvedValue({ data: null });
  });

  it('blocks an empty display name', async () => {
    const user = userEvent.setup();
    renderForm();
    const input = screen.getByTestId(TEST_IDS.account.displayNameInput);
    await user.clear(input);
    await user.type(input, '   ');
    await user.click(screen.getByTestId(TEST_IDS.account.save));
    expect(await screen.findByText(account.validation.displayNameRequired)).toBeTruthy();
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('blocks a name over 60 characters', async () => {
    const user = userEvent.setup();
    renderForm();
    const input = screen.getByTestId(TEST_IDS.account.displayNameInput);
    await user.clear(input);
    await user.click(input);
    await user.paste('x'.repeat(61));
    await user.click(screen.getByTestId(TEST_IDS.account.save));
    expect(await screen.findByText(account.validation.displayNameTooLong)).toBeTruthy();
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('saves a valid name to the profile and the auth user', async () => {
    const user = userEvent.setup();
    renderForm();
    const input = screen.getByTestId(TEST_IDS.account.displayNameInput);
    await user.clear(input);
    await user.type(input, 'Grace');
    await user.click(screen.getByTestId(TEST_IDS.account.save));
    await waitFor(() =>
      expect(updateProfile).toHaveBeenCalledWith({ uid: 'u1', patch: { displayName: 'Grace' } }),
    );
    expect(updateAuthDisplayName).toHaveBeenCalledWith('Grace');
    expect(await screen.findByText(account.settings.saved)).toBeTruthy();
  });
});
