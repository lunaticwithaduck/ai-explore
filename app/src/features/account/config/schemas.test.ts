import { describe, expect, it } from 'vitest';
import { displayNameSchema } from './schemas';

const issueOf = (displayName: string) => {
  const result = displayNameSchema.safeParse({ displayName });
  return result.success ? null : result.error.issues[0]?.message;
};

describe('displayNameSchema', () => {
  it('accepts 1 to 60 characters and trims', () => {
    expect(displayNameSchema.parse({ displayName: '  A ' })).toEqual({ displayName: 'A' });
    expect(issueOf('x'.repeat(60))).toBeNull();
  });

  it('rejects empty and whitespace-only names', () => {
    expect(issueOf('')).toBe('validation.displayNameRequired');
    expect(issueOf('   ')).toBe('validation.displayNameRequired');
  });

  it('rejects names over 60 characters', () => {
    expect(issueOf('x'.repeat(61))).toBe('validation.displayNameTooLong');
  });
});
