import { COLLECTION_LIMITS } from '@ai-explore/schemas';
import { describe, expect, it } from 'vitest';
import { collectionNameSchema } from '../config/schemas';
import { canAddTool, nextCollectionStyle } from './collections';

const idsOf = (n: number) => Array.from({ length: n }, (_, i) => `tool-${i}`);

describe('collectionNameSchema', () => {
  it('trims and accepts a normal name', () => {
    expect(collectionNameSchema.parse('  Design  ')).toBe('Design');
  });

  it('rejects an empty or whitespace-only name', () => {
    expect(collectionNameSchema.safeParse('   ').error?.issues[0]?.message).toBe(
      'validation.nameRequired',
    );
  });

  it('accepts exactly the maximum length and rejects one more', () => {
    expect(collectionNameSchema.safeParse('a'.repeat(COLLECTION_LIMITS.nameMax)).success).toBe(
      true,
    );
    expect(
      collectionNameSchema.safeParse('a'.repeat(COLLECTION_LIMITS.nameMax + 1)).error?.issues[0]
        ?.message,
    ).toBe('validation.nameTooLong');
  });
});

describe('canAddTool', () => {
  it('allows adding below the cap', () => {
    expect(canAddTool(idsOf(COLLECTION_LIMITS.toolIdsMax - 1), 'new-tool')).toBe(true);
  });

  it('blocks a new tool at the cap', () => {
    expect(canAddTool(idsOf(COLLECTION_LIMITS.toolIdsMax), 'new-tool')).toBe(false);
  });

  it('still allows a tool that is already a member at the cap, so it can be removed', () => {
    expect(canAddTool(idsOf(COLLECTION_LIMITS.toolIdsMax), 'tool-3')).toBe(true);
  });
});

describe('nextCollectionStyle', () => {
  it('cycles icon and colour by order', () => {
    expect(nextCollectionStyle(0)).toEqual({ icon: 'folder', color: 'blue' });
    expect(nextCollectionStyle(8).color).toBe('blue');
    expect(nextCollectionStyle(1).color).toBe('violet');
  });
});
