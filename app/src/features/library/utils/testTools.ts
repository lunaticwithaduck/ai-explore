import type { Tool, WithId } from '@ai-explore/schemas';

type Overrides = Partial<Omit<Tool, 'pricing' | 'rating'>> & {
  pricing?: Partial<Tool['pricing']>;
  rating?: Tool['rating'];
};

export function makeTool(id: string, overrides: Overrides = {}): WithId<Tool> {
  const { pricing, ...rest } = overrides;
  return {
    id,
    slug: id,
    name: id,
    developer: 'Acme',
    websiteUrl: 'https://example.com',
    tagline: { en: 'A tool' },
    description: { en: 'A tool' },
    categoryId: 'text',
    tags: [],
    logo: { path: '/logos/a.svg', background: 'black' },
    pricing: { hasFreePlan: false, ...pricing },
    plans: [],
    features: [],
    tutorials: [],
    comparison: {
      apiAccess: 'none',
      integrations: 0,
      speed: 3,
      outputQuality: 3,
      bestUseCase: { en: 'x' },
    },
    similarToolIds: [],
    complementaryToolIds: [],
    rating: { count: 0, sum: 0 },
    published: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    lastReleaseAt: new Date(0),
    ...rest,
  };
}
