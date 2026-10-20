import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type ReviewDoc,
  useHelpfulVoteQuery,
  useToolRatingQuery,
  useToolReviewsQuery,
} from '@/api/endpoints/reviews';
import { makeStore } from '@/api/store';
import { TEST_IDS } from '@/config/test-ids';
import { authStateChanged } from '@/features/auth/state/authSlice';
import errors from '@/messages/en/errors.json';
import reviews from '@/messages/en/reviews.json';
import {
  createReview,
  deleteReview,
  unvoteHelpful,
  updateReview,
  voteHelpful,
} from '../../utils/reviewBatch';
import { ReviewsSection } from './ReviewsSection';

const db = vi.hoisted(() => ({ name: 'db' }));

vi.mock('@/lib/firebase/client', () => ({ clientDb: () => db }));
vi.mock('@/api/endpoints/profile', () => ({
  useProfileQuery: () => ({ currentData: undefined, isSuccess: false }),
}));
vi.mock('@/api/endpoints/reviews', () => ({
  useToolRatingQuery: vi.fn(),
  useToolReviewsQuery: vi.fn(),
  useHelpfulVoteQuery: vi.fn(),
}));
vi.mock('../../utils/reviewBatch', () => ({
  createReview: vi.fn(() => Promise.resolve()),
  updateReview: vi.fn(() => Promise.resolve()),
  deleteReview: vi.fn(() => Promise.resolve()),
  voteHelpful: vi.fn(() => Promise.resolve()),
  unvoteHelpful: vi.fn(() => Promise.resolve()),
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/tools/jasper',
}));

const me = { uid: 'me', email: 'ada@example.com', displayName: 'Ada', photoUrl: null };

const review = (authorUid: string, rating: number, helpfulCount = 0, day = 1): ReviewDoc => ({
  id: authorUid,
  toolId: 'jasper',
  authorUid,
  rating,
  body: `Body by ${authorUid}`,
  authorName: `Name ${authorUid}`,
  authorPhotoUrl: null,
  locale: 'en',
  helpfulCount,
  createdAt: new Date(Date.UTC(2026, 9, day)),
  updatedAt: new Date(Date.UTC(2026, 9, day)),
});

const withReviews = (list: ReviewDoc[] | undefined) =>
  vi.mocked(useToolReviewsQuery).mockReturnValue({ currentData: list, error: undefined } as never);

const renderSection = (signedIn: boolean) => {
  const store = makeStore();
  store.dispatch(authStateChanged(signedIn ? me : null));
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={{ reviews, errors }}>
        <ReviewsSection toolId="jasper" />
      </NextIntlClientProvider>
    </Provider>,
  );
};

const items = () => screen.getAllByTestId(TEST_IDS.reviews.item);
const helpfulOf = (uid: string) =>
  within(items().find((item) => item.dataset.id === uid) as HTMLElement).getByTestId(
    TEST_IDS.reviews.helpful,
  );

describe('ReviewsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useToolRatingQuery).mockReturnValue({ currentData: { count: 2, sum: 9 } } as never);
    vi.mocked(useHelpfulVoteQuery).mockReturnValue({ currentData: false } as never);
  });

  it('asks a visitor to sign in and sends Helpful to sign-in with next', () => {
    withReviews([review('other', 5, 3)]);
    renderSection(false);
    const next = `/sign-in?next=${encodeURIComponent('/tools/jasper')}`;
    expect(screen.getByRole('link', { name: reviews.signIn.action })).toHaveAttribute('href', next);
    expect(helpfulOf('other')).toHaveAttribute('href', next);
    expect(screen.queryByTestId(TEST_IDS.reviews.form)).not.toBeInTheDocument();
  });

  it('requires a rating, then creates the review through the batch helper', async () => {
    withReviews([]);
    renderSection(true);
    const user = userEvent.setup();
    const form = screen.getByTestId(TEST_IDS.reviews.form);
    await user.type(within(form).getByTestId(TEST_IDS.reviews.bodyInput), 'Solid tool.');
    expect(within(form).getByText('11 / 2000')).toBeInTheDocument();
    await user.click(within(form).getByTestId(TEST_IDS.reviews.submit));
    expect(await screen.findByText(reviews.form.validation.ratingRequired)).toBeInTheDocument();
    expect(createReview).not.toHaveBeenCalled();

    const rating = within(form).getByTestId(TEST_IDS.reviews.ratingInput);
    await user.click(rating.querySelector('[data-id="4"]') as HTMLElement);
    await user.click(within(form).getByTestId(TEST_IDS.reviews.submit));
    await waitFor(() =>
      expect(createReview).toHaveBeenCalledWith(
        db,
        'jasper',
        { uid: 'me', displayName: 'Ada', photoUrl: null },
        { rating: 4, body: 'Solid tool.', locale: 'en' },
      ),
    );
  });

  it('shows the own review first, edits it prefilled and deletes it after confirming', async () => {
    withReviews([review('other', 5, 1, 9), review('me', 4, 0, 2)]);
    renderSection(true);
    const user = userEvent.setup();
    expect(items()[0]).toHaveAttribute('data-id', 'me');
    expect(screen.queryByTestId(TEST_IDS.reviews.form)).not.toBeInTheDocument();
    expect(helpfulOf('me')).toBeDisabled();

    await user.click(screen.getByTestId(TEST_IDS.reviews.edit));
    const form = screen.getByTestId(TEST_IDS.reviews.form);
    expect(within(form).getByTestId(TEST_IDS.reviews.bodyInput)).toHaveValue('Body by me');
    const rating = within(form).getByTestId(TEST_IDS.reviews.ratingInput);
    expect(rating.querySelector('[data-id="4"]')).toHaveAttribute('aria-checked', 'true');
    await user.click(rating.querySelector('[data-id="2"]') as HTMLElement);
    await user.click(within(form).getByTestId(TEST_IDS.reviews.submit));
    await waitFor(() =>
      expect(updateReview).toHaveBeenCalledWith(db, 'jasper', 'me', 4, {
        rating: 2,
        body: 'Body by me',
      }),
    );
    await waitFor(() =>
      expect(screen.queryByTestId(TEST_IDS.reviews.form)).not.toBeInTheDocument(),
    );

    await user.click(screen.getByTestId(TEST_IDS.reviews.delete));
    expect(deleteReview).not.toHaveBeenCalled();
    await user.click(await screen.findByTestId(TEST_IDS.reviews.confirmDelete));
    expect(deleteReview).toHaveBeenCalledWith(db, 'jasper', 'me', 4);
  });

  it('votes helpful on someone else review', async () => {
    withReviews([review('other', 5, 3)]);
    renderSection(true);
    expect(helpfulOf('other')).toHaveAttribute('aria-pressed', 'false');
    expect(helpfulOf('other')).toHaveTextContent('Helpful (3)');
    await userEvent.setup().click(helpfulOf('other'));
    expect(voteHelpful).toHaveBeenCalledWith(db, 'jasper', 'other', 'me');
    expect(unvoteHelpful).not.toHaveBeenCalled();
  });

  it('withdraws an existing helpful vote', async () => {
    vi.mocked(useHelpfulVoteQuery).mockReturnValue({ currentData: true } as never);
    withReviews([review('other', 5, 4)]);
    renderSection(true);
    expect(helpfulOf('other')).toHaveAttribute('aria-pressed', 'true');
    await userEvent.setup().click(helpfulOf('other'));
    expect(unvoteHelpful).toHaveBeenCalledWith(db, 'jasper', 'other', 'me');
    expect(voteHelpful).not.toHaveBeenCalled();
  });

  it('sorts the others by most helpful on request', async () => {
    withReviews([review('a', 5, 1, 9), review('b', 3, 7, 2), review('c', 4, 0, 5)]);
    renderSection(false);
    expect(items().map((item) => item.dataset.id)).toEqual(['a', 'c', 'b']);
    await userEvent.setup().click(screen.getByRole('radio', { name: reviews.list.sort.helpful }));
    expect(items().map((item) => item.dataset.id)).toEqual(['b', 'a', 'c']);
  });

  it('shows a translated error when a write is rejected', async () => {
    vi.mocked(deleteReview).mockRejectedValueOnce(
      Object.assign(new Error('Missing or insufficient permissions.'), {
        code: 'permission-denied',
      }),
    );
    withReviews([review('me', 4)]);
    renderSection(true);
    const user = userEvent.setup();
    await user.click(screen.getByTestId(TEST_IDS.reviews.delete));
    await user.click(await screen.findByTestId(TEST_IDS.reviews.confirmDelete));
    expect(await screen.findByRole('alert')).toHaveTextContent(errors['permission-denied']);
  });
});
