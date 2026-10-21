import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TEST_IDS } from '@/config/test-ids';
import reviews from '@/messages/en/reviews.json';
import { DeleteReviewDialog } from './DeleteReviewDialog';

vi.mock('@ai-explore/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ai-explore/ui')>()),
  DialogClose: ({ children }: { children: ReactNode }) => children,
}));

const renderDialog = (disabled = false) => {
  const onConfirm = vi.fn();
  const view = render(
    <NextIntlClientProvider locale="en" messages={{ reviews }}>
      <DeleteReviewDialog disabled={disabled} onConfirm={onConfirm} />
    </NextIntlClientProvider>,
  );
  const rerender = (next: boolean) =>
    view.rerender(
      <NextIntlClientProvider locale="en" messages={{ reviews }}>
        <DeleteReviewDialog disabled={next} onConfirm={onConfirm} />
      </NextIntlClientProvider>,
    );
  return { onConfirm, rerender };
};

const confirmButton = () => screen.getByTestId(TEST_IDS.reviews.confirmDelete);

describe('DeleteReviewDialog', () => {
  it('confirms once and disables the button on a double click', async () => {
    const { onConfirm } = renderDialog();
    const user = userEvent.setup();
    await user.click(screen.getByTestId(TEST_IDS.reviews.delete));
    await user.dblClick(confirmButton());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirmButton()).toBeDisabled();
  });

  it('keeps the confirm button disabled while a write is pending', async () => {
    const { onConfirm, rerender } = renderDialog();
    const user = userEvent.setup();
    await user.click(screen.getByTestId(TEST_IDS.reviews.delete));
    rerender(true);
    expect(confirmButton()).toBeDisabled();
    await user.click(confirmButton());
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('allows a fresh attempt after the dialog is reopened', async () => {
    const { onConfirm } = renderDialog();
    const user = userEvent.setup();
    await user.click(screen.getByTestId(TEST_IDS.reviews.delete));
    await user.click(confirmButton());
    await user.click(screen.getByRole('button', { name: reviews.delete.close }));
    await user.click(screen.getByTestId(TEST_IDS.reviews.delete));
    expect(confirmButton()).toBeEnabled();
    await user.click(confirmButton());
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });
});
