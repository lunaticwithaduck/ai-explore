import { describe, expect, it } from 'vitest';
import bg from '../../../messages/bg/auth.json';
import en from '../../../messages/en/auth.json';
import { AUTH_ERROR_KEYS, toAuthErrorKey } from './authErrors';

const authError = (code: string) =>
  Object.assign(new Error(`Firebase: Error (${code}).`), { code });

describe('toAuthErrorKey', () => {
  it.each([
    ['auth/invalid-credential', 'invalidCredential'],
    ['auth/invalid-login-credentials', 'invalidCredential'],
    ['auth/wrong-password', 'invalidCredential'],
    ['auth/user-not-found', 'invalidCredential'],
    ['auth/email-already-in-use', 'emailInUse'],
    ['auth/weak-password', 'weakPassword'],
    ['auth/invalid-email', 'invalidEmail'],
    ['auth/user-disabled', 'userDisabled'],
    ['auth/too-many-requests', 'tooManyRequests'],
    ['auth/network-request-failed', 'network'],
    ['auth/popup-blocked', 'popupBlocked'],
    ['auth/account-exists-with-different-credential', 'accountExists'],
  ])('maps %s to %s', (code, key) => {
    expect(toAuthErrorKey(authError(code))).toBe(key);
  });

  it('stays silent when the user closes the Google popup', () => {
    expect(toAuthErrorKey(authError('auth/popup-closed-by-user'))).toBeNull();
    expect(toAuthErrorKey(authError('auth/cancelled-popup-request'))).toBeNull();
  });

  it('falls back to unknown for anything else, never the raw message', () => {
    expect(toAuthErrorKey(authError('auth/internal-error'))).toBe('unknown');
    expect(toAuthErrorKey(new Error('boom'))).toBe('unknown');
    expect(toAuthErrorKey('nope')).toBe('unknown');
    expect(toAuthErrorKey(null)).toBe('unknown');
  });

  it('has copy for every key in both locales', () => {
    for (const key of AUTH_ERROR_KEYS) {
      expect(en.errors[key]).toBeTruthy();
      expect(bg.errors[key]).toBeTruthy();
    }
  });
});
