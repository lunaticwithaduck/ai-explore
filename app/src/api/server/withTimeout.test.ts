import { afterEach, describe, expect, it, vi } from 'vitest';
import { toAppError } from '../errors';
import { ServerReadTimeoutError, withTimeout } from './withTimeout';

describe('withTimeout', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves with the work result when it finishes in time', async () => {
    await expect(withTimeout(Promise.resolve(7), 50)).resolves.toBe(7);
  });

  it('throws an unavailable error when the work hangs', async () => {
    vi.useFakeTimers();
    const pending = withTimeout(new Promise<never>(() => undefined), 4000);
    const assertion = expect(pending).rejects.toBeInstanceOf(ServerReadTimeoutError);
    await vi.advanceTimersByTimeAsync(4000);
    await assertion;
    await pending.catch((error: unknown) => {
      expect(toAppError(error).code).toBe('unavailable');
    });
  });

  it('passes through the work rejection', async () => {
    await expect(withTimeout(Promise.reject(new Error('boom')), 50)).rejects.toThrow('boom');
  });
});
