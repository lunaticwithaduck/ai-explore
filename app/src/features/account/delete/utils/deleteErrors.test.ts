import { describe, expect, it } from 'vitest';
import { toDeleteError } from './deleteErrors';

const withCode = (code: string) => Object.assign(new Error(code), { code });

describe('toDeleteError', () => {
  it('maps a wrong password to the account message', () => {
    expect(toDeleteError(withCode('auth/invalid-credential'))).toEqual({
      scope: 'delete',
      key: 'wrongPassword',
    });
  });

  it('tells a Google user they picked a different account', () => {
    expect(toDeleteError(withCode('auth/user-mismatch'))).toEqual({
      scope: 'delete',
      key: 'wrongGoogleAccount',
    });
  });

  it('maps Firestore failures to the shared errors namespace', () => {
    expect(toDeleteError(withCode('permission-denied'))).toEqual({
      scope: 'errors',
      key: 'permission-denied',
    });
    expect(toDeleteError(withCode('auth/network-request-failed'))).toEqual({
      scope: 'errors',
      key: 'unavailable',
    });
  });

  it('stays quiet when the Google window is closed', () => {
    expect(toDeleteError(withCode('auth/popup-closed-by-user'))).toBeNull();
  });

  it('falls back to unknown', () => {
    expect(toDeleteError(new Error('boom'))).toEqual({ scope: 'errors', key: 'unknown' });
  });
});
