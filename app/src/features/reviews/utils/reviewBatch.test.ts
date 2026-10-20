import type { Firestore } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createReview,
  deleteReview,
  unvoteHelpful,
  updateReview,
  voteHelpful,
} from './reviewBatch';

const batch = vi.hoisted(() => ({
  set: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  commit: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/firestore', () => ({
  doc: (_db: unknown, ...segments: string[]) => segments.join('/'),
  writeBatch: () => batch,
  increment: (n: number) => ({ increment: n }),
  serverTimestamp: () => 'SERVER_TIME',
}));

const db = {} as Firestore;
const author = { uid: 'u1', displayName: 'Ada', photoUrl: null };

describe('reviewBatch', () => {
  beforeEach(() => {
    for (const fn of Object.values(batch)) fn.mockClear();
  });

  it('creates the review with exact fields and moves count and sum together', async () => {
    await createReview(db, 'jasper', author, { rating: 4, body: 'Solid.', locale: 'bg' });
    expect(batch.set).toHaveBeenCalledWith('tools/jasper/reviews/u1', {
      toolId: 'jasper',
      authorUid: 'u1',
      rating: 4,
      body: 'Solid.',
      authorName: 'Ada',
      authorPhotoUrl: null,
      locale: 'bg',
      helpfulCount: 0,
      createdAt: 'SERVER_TIME',
      updatedAt: 'SERVER_TIME',
    });
    expect(batch.update).toHaveBeenCalledExactlyOnceWith('tools/jasper', {
      'rating.count': { increment: 1 },
      'rating.sum': { increment: 4 },
    });
    expect(batch.commit).toHaveBeenCalledOnce();
  });

  it('moves the sum by the rating delta when an edit changes the rating', async () => {
    await updateReview(db, 'jasper', 'u1', 4, { rating: 2, body: 'Meh.' });
    expect(batch.update).toHaveBeenCalledTimes(2);
    expect(batch.update).toHaveBeenNthCalledWith(1, 'tools/jasper/reviews/u1', {
      rating: 2,
      body: 'Meh.',
      updatedAt: 'SERVER_TIME',
    });
    expect(batch.update).toHaveBeenNthCalledWith(2, 'tools/jasper', {
      'rating.sum': { increment: -2 },
    });
  });

  it('adds no tool update when an edit keeps the rating', async () => {
    await updateReview(db, 'jasper', 'u1', 3, { rating: 3, body: 'Same stars, new words.' });
    expect(batch.update).toHaveBeenCalledExactlyOnceWith('tools/jasper/reviews/u1', {
      rating: 3,
      body: 'Same stars, new words.',
      updatedAt: 'SERVER_TIME',
    });
    expect(batch.commit).toHaveBeenCalledOnce();
  });

  it('deletes the review and takes one off the count and the rating off the sum', async () => {
    await deleteReview(db, 'jasper', 'u1', 5);
    expect(batch.delete).toHaveBeenCalledExactlyOnceWith('tools/jasper/reviews/u1');
    expect(batch.update).toHaveBeenCalledExactlyOnceWith('tools/jasper', {
      'rating.count': { increment: -1 },
      'rating.sum': { increment: -5 },
    });
  });

  it('pairs a helpful vote with helpfulCount +1', async () => {
    await voteHelpful(db, 'jasper', 'author', 'voter');
    expect(batch.set).toHaveBeenCalledExactlyOnceWith('tools/jasper/reviews/author/votes/voter', {
      createdAt: 'SERVER_TIME',
    });
    expect(batch.update).toHaveBeenCalledExactlyOnceWith('tools/jasper/reviews/author', {
      helpfulCount: { increment: 1 },
    });
  });

  it('pairs withdrawing a vote with helpfulCount -1', async () => {
    await unvoteHelpful(db, 'jasper', 'author', 'voter');
    expect(batch.delete).toHaveBeenCalledExactlyOnceWith('tools/jasper/reviews/author/votes/voter');
    expect(batch.update).toHaveBeenCalledExactlyOnceWith('tools/jasper/reviews/author', {
      helpfulCount: { increment: -1 },
    });
  });

  it('surfaces a rejected commit to the caller', async () => {
    batch.commit.mockReturnValueOnce(Promise.reject(new Error('permission-denied')));
    await expect(deleteReview(db, 'jasper', 'u1', 3)).rejects.toThrow('permission-denied');
  });
});
