import type { User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteReview } from '@/features/reviews/utils/reviewBatch';
import { DELETE_BATCH_SIZE } from '../config/constants';
import { deleteAccount } from './deleteAccount';

const calls = vi.hoisted(() => [] as string[]);

const store = vi.hoisted(() => ({
  reviews: [] as { id: string; data: () => unknown }[],
  subcollections: {} as Record<string, string[]>,
}));

const deleteUser = vi.hoisted(() => vi.fn());

vi.mock('firebase/auth', () => ({ deleteUser }));

vi.mock('firebase/firestore', () => ({
  collectionGroup: (_db: unknown, name: string) => ({ group: name }),
  where: (field: string, op: string, value: string) => ({ where: `${field} ${op} ${value}` }),
  query: (source: object, ...constraints: object[]) => ({ ...source, constraints }),
  collection: (_db: unknown, ...segments: string[]) => ({ path: segments.join('/') }),
  doc: (_db: unknown, ...segments: string[]) => segments.join('/'),
  getDocs: async (source: { group?: string; path?: string; constraints?: unknown[] }) => {
    if (source.group) {
      calls.push(`query ${source.group} ${JSON.stringify(source.constraints)}`);
      return { docs: store.reviews };
    }
    const name = source.path?.split('/').at(-1) ?? '';
    const ids = store.subcollections[name] ?? [];
    return { docs: ids.map((id) => ({ id, ref: `${source.path}/${id}` })) };
  },
  writeBatch: () => {
    const refs: string[] = [];
    return {
      delete: (ref: string) => refs.push(ref),
      commit: async () => {
        calls.push(`batch ${refs.join(',')}`);
      },
    };
  },
  deleteDoc: async (ref: string) => {
    calls.push(`deleteDoc ${ref}`);
  },
}));

vi.mock('@/features/reviews/utils/reviewBatch', () => ({
  deleteReview: vi.fn(async (_db: unknown, toolId: string, uid: string, rating: number) => {
    calls.push(`deleteReview ${toolId} ${uid} ${rating}`);
  }),
}));

const db = {} as Firestore;
const user = { uid: 'u1' } as User;

const review = (toolId: string, rating: number) => ({
  id: 'u1',
  data: () => ({ toolId, rating, authorUid: 'u1' }),
});

const recentLoginError = Object.assign(new Error('recent'), {
  code: 'auth/requires-recent-login',
});

const logReauth = async () => {
  calls.push('reauth');
};

const run = (reauthenticate = vi.fn(logReauth)) => {
  const onStep = vi.fn((step: string) => {
    calls.push(`step ${step}`);
  });
  return {
    reauthenticate,
    onStep,
    done: deleteAccount({ db, user, reauthenticate, onStep }),
  };
};

describe('deleteAccount', () => {
  beforeEach(() => {
    calls.length = 0;
    store.reviews = [review('chatgpt', 4), review('midjourney', 2)];
    store.subcollections = { saved: ['chatgpt'], collections: ['c1', 'c2'], bundleInterest: [] };
    deleteUser.mockReset();
    deleteUser.mockImplementation(async () => {
      calls.push('deleteUser');
    });
    vi.mocked(deleteReview).mockClear();
  });

  it('deletes reviews, then the library, then the profile, then the auth user', async () => {
    const { done, reauthenticate } = run();
    await done;
    expect(calls).toEqual([
      'step reviews',
      'query reviews [{"where":"authorUid == u1"}]',
      'deleteReview chatgpt u1 4',
      'deleteReview midjourney u1 2',
      'step library',
      'batch users/u1/saved/chatgpt',
      'batch users/u1/collections/c1,users/u1/collections/c2',
      'step profile',
      'deleteDoc users/u1',
      'step account',
      'deleteUser',
    ]);
    expect(reauthenticate).not.toHaveBeenCalled();
  });

  it('splits a large subcollection into several batches', async () => {
    store.subcollections = {
      saved: Array.from({ length: DELETE_BATCH_SIZE + 1 }, (_, index) => `t${index}`),
    };
    await run().done;
    const savedBatches = calls.filter((call) => call.startsWith('batch users/u1/saved/'));
    expect(savedBatches).toHaveLength(2);
    expect(savedBatches[1]).toBe(`batch users/u1/saved/t${DELETE_BATCH_SIZE}`);
  });

  it('skips reviews that fail to parse instead of guessing their rating', async () => {
    store.reviews = [review('chatgpt', 4), { id: 'u1', data: () => ({ toolId: 'x', rating: 9 }) }];
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    await run().done;
    expect(deleteReview).toHaveBeenCalledTimes(1);
    expect(deleteReview).toHaveBeenCalledWith(db, 'chatgpt', 'u1', 4);
  });

  it('reauthenticates and retries the auth delete once when it needs a recent login', async () => {
    deleteUser.mockRejectedValueOnce(recentLoginError);
    const { done, reauthenticate } = run();
    await done;
    expect(reauthenticate).toHaveBeenCalledTimes(1);
    expect(deleteUser).toHaveBeenCalledTimes(2);
    expect(calls.slice(-4)).toEqual(['deleteDoc users/u1', 'step account', 'reauth', 'deleteUser']);
  });

  it('does not retry a second time when the retry also fails', async () => {
    deleteUser.mockRejectedValue(recentLoginError);
    const { done, reauthenticate } = run();
    await expect(done).rejects.toBe(recentLoginError);
    expect(reauthenticate).toHaveBeenCalledTimes(1);
    expect(deleteUser).toHaveBeenCalledTimes(2);
  });

  it('does not reauthenticate for other auth errors', async () => {
    const network = Object.assign(new Error('net'), { code: 'auth/network-request-failed' });
    deleteUser.mockRejectedValueOnce(network);
    const { done, reauthenticate } = run();
    await expect(done).rejects.toBe(network);
    expect(reauthenticate).not.toHaveBeenCalled();
  });

  it('stops before touching the library when a review delete fails', async () => {
    const denied = Object.assign(new Error('denied'), { code: 'permission-denied' });
    vi.mocked(deleteReview).mockRejectedValueOnce(denied);
    await expect(run().done).rejects.toBe(denied);
    expect(calls).not.toContain('step library');
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it('stops without deleting the sign-in when the fallback reauth is cancelled', async () => {
    deleteUser.mockRejectedValueOnce(recentLoginError);
    const cancelled = new Error('cancelled');
    const { done } = run(vi.fn(() => Promise.reject(cancelled)));
    await expect(done).rejects.toBe(cancelled);
    expect(deleteUser).toHaveBeenCalledTimes(1);
    expect(calls).toContain('deleteDoc users/u1');
  });
});
