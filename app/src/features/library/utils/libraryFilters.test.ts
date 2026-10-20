import { describe, expect, it } from 'vitest';
import { EMPTY_FILTERS, filterTools, parseFilters, toQuery } from './libraryFilters';
import { makeTool } from './testTools';

const tools = [
  makeTool('midjourney', {
    name: 'Midjourney',
    developer: 'Midjourney Inc',
    tagline: { en: 'Images from prompts', bg: 'Изображения' },
    tags: ['image', 'art'],
    categoryId: 'image',
    pricing: { hasFreePlan: false, trialDays: 7 },
  }),
  makeTool('chatgpt', {
    name: 'ChatGPT',
    developer: 'OpenAI',
    tagline: { en: 'Chat assistant' },
    tags: ['chat'],
    categoryId: 'text',
    pricing: { hasFreePlan: true },
  }),
  makeTool('sd', {
    name: 'Stable Diffusion',
    developer: 'Stability',
    tags: ['image', 'open-source'],
    categoryId: 'image',
    pricing: { hasFreePlan: true, trialDays: 14 },
  }),
];

const ids = (list: { id: string }[]) => list.map((t) => t.id);

describe('filterTools', () => {
  const cases: [string, Partial<typeof EMPTY_FILTERS>, string[]][] = [
    ['no filters', {}, ['midjourney', 'chatgpt', 'sd']],
    ['name, case-insensitive', { q: 'MID' }, ['midjourney']],
    ['developer', { q: 'openai' }, ['chatgpt']],
    ['tag text', { q: 'open-source' }, ['sd']],
    ['english tagline', { q: 'assistant' }, ['chatgpt']],
    ['bulgarian tagline', { q: 'изобр' }, ['midjourney']],
    ['whitespace query', { q: '  ' }, ['midjourney', 'chatgpt', 'sd']],
    ['no match', { q: 'zzz' }, []],
    ['category', { category: 'image' }, ['midjourney', 'sd']],
    ['tags all must match', { tags: ['image', 'art'] }, ['midjourney']],
    ['free plan', { price: 'free' }, ['chatgpt', 'sd']],
    ['has trial', { price: 'trial' }, ['midjourney', 'sd']],
    ['paid only', { price: 'paid' }, ['midjourney']],
    ['combined', { category: 'image', price: 'free', q: 'stable' }, ['sd']],
  ];
  it.each(cases)('%s', (_name, patch, expected) => {
    expect(ids(filterTools(tools, { ...EMPTY_FILTERS, ...patch }))).toEqual(expected);
  });
});

describe('parseFilters and toQuery', () => {
  it('reads every param', () => {
    const params = new URLSearchParams('q=a&category=c&tags=x,y&sort=price-asc&price=trial');
    expect(parseFilters(params)).toEqual({
      q: 'a',
      category: 'c',
      tags: ['x', 'y'],
      sort: 'priceAsc',
      price: 'trial',
    });
  });

  it('falls back on invalid values', () => {
    const parsed = parseFilters(new URLSearchParams('sort=nope&price=nope'));
    expect(parsed.sort).toBe('rating');
    expect(parsed.price).toBe('all');
  });

  it('omits defaults when writing', () => {
    expect(toQuery(EMPTY_FILTERS)).toEqual({
      q: undefined,
      category: undefined,
      tags: [],
      sort: undefined,
      price: undefined,
    });
  });
});
