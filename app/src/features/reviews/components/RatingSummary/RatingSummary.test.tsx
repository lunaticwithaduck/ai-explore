import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useToolRatingQuery } from '@/api/endpoints/reviews';
import { TEST_IDS } from '@/config/test-ids';
import reviews from '@/messages/en/reviews.json';
import { RatingSummary } from './RatingSummary';

vi.mock('@/api/endpoints/reviews', () => ({ useToolRatingQuery: vi.fn() }));

const withRating = (currentData: unknown, isError = false) =>
  vi.mocked(useToolRatingQuery).mockReturnValue({ currentData, isError } as never);

const renderSummary = (locale = 'en') =>
  render(
    <NextIntlClientProvider locale={locale} messages={{ reviews }}>
      <RatingSummary toolId="jasper" />
    </NextIntlClientProvider>,
  );

describe('RatingSummary', () => {
  beforeEach(() => vi.mocked(useToolRatingQuery).mockReset());

  it('shows the live average to one decimal and the count', () => {
    withRating({ count: 3, sum: 13 });
    renderSummary();
    expect(screen.getByTestId(TEST_IDS.tool.ratingAverage)).toHaveTextContent('4.3');
    expect(screen.getByTestId(TEST_IDS.tool.ratingCount)).toHaveTextContent('3 reviews');
    expect(screen.getByRole('img', { name: 'Rated 4.3 out of 5' })).toBeInTheDocument();
  });

  it('renders "No reviews yet" and neither id when the count is zero', () => {
    withRating({ count: 0, sum: 0 });
    renderSummary();
    expect(screen.getByText(reviews.summary.empty)).toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.tool.ratingAverage)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.tool.ratingCount)).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/NaN|0\.0/);
  });

  it('renders neither id while loading or on error', () => {
    withRating(undefined);
    const { unmount } = renderSummary();
    expect(screen.queryByTestId(TEST_IDS.tool.ratingAverage)).not.toBeInTheDocument();
    unmount();
    withRating(undefined, true);
    renderSummary();
    expect(screen.queryByTestId(TEST_IDS.tool.ratingCount)).not.toBeInTheDocument();
  });
});
