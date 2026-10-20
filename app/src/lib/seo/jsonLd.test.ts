import type { Tool, WithId } from '@ai-explore/schemas';
import { buildToolJsonLd, serializeJsonLd } from './jsonLd';

const make = (overrides: Partial<Tool> = {}) =>
  ({
    id: 'midjourney',
    name: 'Midjourney',
    tagline: { en: 'Images', bg: 'Изображения' },
    categoryId: 'image',
    logo: { path: '/logos/midjourney.png', background: '#000000' },
    pricing: { hasFreePlan: false, fromPriceCents: 1000 },
    rating: { count: 0, sum: 0 },
    ...overrides,
  }) as unknown as WithId<Tool>;

describe('buildToolJsonLd', () => {
  it('omits aggregateRating without reviews', () => {
    const ld = buildToolJsonLd(make(), 'en', 'https://x.test');
    expect(ld['@type']).toBe('SoftwareApplication');
    expect(ld.aggregateRating).toBeUndefined();
    expect(ld.offers).toEqual({ '@type': 'Offer', price: '10.00', priceCurrency: 'USD' });
    expect(ld.url).toBe('https://x.test/tools/midjourney');
    expect(ld.image).toBe('https://x.test/logos/midjourney.png');
  });

  it('includes aggregateRating with reviews and localises bg', () => {
    const ld = buildToolJsonLd(make({ rating: { count: 4, sum: 18 } }), 'bg', 'https://x.test');
    expect(ld.aggregateRating).toMatchObject({ ratingValue: 4.5, ratingCount: 4 });
    expect(ld.description).toBe('Изображения');
    expect(ld.url).toBe('https://x.test/bg/tools/midjourney');
  });

  it('is free when there is a free plan and omits offers with no price', () => {
    const free = buildToolJsonLd(make({ pricing: { hasFreePlan: true } }), 'en', 'https://x.test');
    expect(free.offers?.price).toBe('0.00');
    const none = buildToolJsonLd(make({ pricing: { hasFreePlan: false } }), 'en', 'https://x.test');
    expect(none.offers).toBeUndefined();
  });
});

describe('serializeJsonLd', () => {
  it('escapes <', () => {
    const out = serializeJsonLd({ a: '</script><b>' });
    expect(out).not.toContain('<');
    expect(JSON.parse(out)).toEqual({ a: '</script><b>' });
  });
});
