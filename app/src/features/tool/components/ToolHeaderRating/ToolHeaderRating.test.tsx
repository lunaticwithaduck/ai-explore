import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToolRatingQuery } from '@/api/endpoints/reviews';
import tool from '@/messages/en/tool.json';
import { ToolHeaderRating } from './ToolHeaderRating';

vi.mock('@/api/endpoints/reviews', () => ({ useToolRatingQuery: vi.fn() }));

const renderRating = () =>
  render(
    <NextIntlClientProvider locale="en" messages={{ tool }}>
      <ToolHeaderRating toolId="jasper" initial={{ count: 2, sum: 8 }} />
    </NextIntlClientProvider>,
  );

describe('ToolHeaderRating', () => {
  beforeEach(() => vi.mocked(useToolRatingQuery).mockReset());

  it('shows the server value until the live one arrives', () => {
    vi.mocked(useToolRatingQuery).mockReturnValue({ currentData: undefined } as never);
    renderRating();
    expect(screen.getByRole('img', { name: 'Rated 4.0 out of 5' })).toBeInTheDocument();
  });

  it('follows the live aggregate once it differs', () => {
    vi.mocked(useToolRatingQuery).mockReturnValue({ currentData: { count: 3, sum: 13 } } as never);
    renderRating();
    expect(screen.getByRole('img', { name: 'Rated 4.3 out of 5' })).toBeInTheDocument();
  });

  it('falls back to no rating when the live aggregate is gone', () => {
    vi.mocked(useToolRatingQuery).mockReturnValue({ currentData: null } as never);
    renderRating();
    expect(screen.getAllByText('No ratings yet').length).toBeGreaterThan(0);
  });
});
