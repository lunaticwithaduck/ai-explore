import { describe, expect, it } from 'vitest';
import { errorCode } from './errorCode';

describe('errorCode', () => {
  it('keeps a known app error code', () => {
    expect(errorCode({ code: 'permission-denied', message: 'no' })).toBe('permission-denied');
  });

  it('maps anything else to unknown', () => {
    expect(errorCode({ code: 'ERR_SOMETHING' })).toBe('unknown');
    expect(errorCode(new Error('boom'))).toBe('unknown');
    expect(errorCode(undefined)).toBe('unknown');
  });
});
