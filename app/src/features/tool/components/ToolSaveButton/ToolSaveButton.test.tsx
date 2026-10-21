import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/api/store';
import { TEST_IDS } from '@/config/test-ids';
import { authStateChanged } from '@/features/auth/state/authSlice';
import errors from '@/messages/en/errors.json';
import tool from '@/messages/en/tool.json';
import { ToolSaveButton } from './ToolSaveButton';

const save = vi.fn();
const unsave = vi.fn();
let savedIds: string[] | undefined = [];

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children?: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/tools/midjourney',
}));

vi.mock('@/api/endpoints/myLibrary', () => ({
  useSavedIdsQuery: () => ({ data: savedIds }),
  useSaveToLibraryMutation: () => [save],
  useUnsaveFromLibraryMutation: () => [unsave],
}));

const renderButton = (signedIn: boolean) => {
  const store = makeStore();
  store.dispatch(
    authStateChanged(
      signedIn ? { uid: 'u1', email: null, displayName: null, photoUrl: null } : null,
    ),
  );
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={{ tool, errors }}>
        <ToolSaveButton toolId="midjourney" />
      </NextIntlClientProvider>
    </Provider>,
  );
};

describe('ToolSaveButton', () => {
  beforeEach(() => {
    save.mockReset().mockResolvedValue({ data: null });
    unsave.mockReset().mockResolvedValue({ data: null });
    savedIds = [];
  });

  it('links signed-out visitors to sign-in with a next parameter', () => {
    renderButton(false);
    const link = screen.getByTestId(TEST_IDS.myLibrary.saveButton);
    expect(link.getAttribute('href')).toBe('/sign-in?next=%2Ftools%2Fmidjourney');
    expect(link).toHaveTextContent(tool.header.save);
  });

  it('saves an unsaved tool when pressed', async () => {
    renderButton(true);
    const button = screen.getByTestId(TEST_IDS.myLibrary.saveButton);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveTextContent(tool.header.save);
    await userEvent.click(button);
    expect(save).toHaveBeenCalledWith({ uid: 'u1', toolId: 'midjourney' });
  });

  it('shows the saved state and unsaves when pressed', async () => {
    savedIds = ['midjourney'];
    renderButton(true);
    const button = screen.getByTestId(TEST_IDS.myLibrary.saveButton);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveTextContent(tool.header.saved);
    await userEvent.click(button);
    expect(unsave).toHaveBeenCalledWith({ uid: 'u1', toolId: 'midjourney' });
  });

  it('shows a translated error when the write fails', async () => {
    save.mockResolvedValue({ error: { code: 'permission-denied', message: 'x' } });
    renderButton(true);
    await userEvent.click(screen.getByTestId(TEST_IDS.myLibrary.saveButton));
    expect((await screen.findByRole('alert')).textContent).toBe(errors['permission-denied']);
  });
});
