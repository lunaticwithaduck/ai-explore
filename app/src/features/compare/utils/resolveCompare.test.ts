import type { Tool, WithId } from '@ai-explore/schemas';
import { describe, expect, it } from 'vitest';
import { defaultSecondTool, resolveCompare } from './resolveCompare';

const tool = (id: string, similarToolIds: string[] = []) =>
  ({ id, slug: id, similarToolIds }) as unknown as WithId<Tool>;

const tools = [
  tool('midjourney', ['dall-e', 'stable-diffusion']),
  tool('stable-diffusion'),
  tool('lonely'),
];

describe('defaultSecondTool', () => {
  it('picks the first similar tool that exists', () => {
    expect(defaultSecondTool(tools, tools[0] as WithId<Tool>)?.id).toBe('stable-diffusion');
  });

  it('is undefined without similar tools', () => {
    expect(defaultSecondTool(tools, tools[2] as WithId<Tool>)).toBeUndefined();
  });
});

describe('resolveCompare', () => {
  it('defaults the second tool when b is missing or invalid', () => {
    expect(resolveCompare(tools, 'midjourney', undefined).second?.id).toBe('stable-diffusion');
    expect(resolveCompare(tools, 'midjourney', 'nope').second?.id).toBe('stable-diffusion');
  });

  it('keeps a valid b and rejects b equal to a', () => {
    expect(resolveCompare(tools, 'midjourney', 'lonely').second?.id).toBe('lonely');
    expect(resolveCompare(tools, 'midjourney', 'midjourney').second?.id).toBe('stable-diffusion');
  });

  it('returns nothing when a is missing or invalid', () => {
    expect(resolveCompare(tools, undefined, 'lonely')).toEqual({
      first: undefined,
      second: undefined,
    });
    expect(resolveCompare(tools, 'nope', undefined).first).toBeUndefined();
  });
});
