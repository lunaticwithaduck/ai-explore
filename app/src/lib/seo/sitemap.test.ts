import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import { buildSitemap } from './sitemap';

const tools = [{ id: 'midjourney' }] as unknown as WithId<Tool>[];
const bundles = [{ id: 'creators' }] as unknown as WithId<Bundle>[];
const site = 'https://x.test';

describe('buildSitemap', () => {
  it('lists static routes, tools and bundles with en and bg alternates', async () => {
    const map = await buildSitemap(
      { getTools: async () => tools, getBundles: async () => bundles },
      site,
    );
    expect(map.map((e) => e.url)).toEqual([
      'https://x.test/',
      'https://x.test/bundles',
      'https://x.test/compare',
      'https://x.test/tools/midjourney',
      'https://x.test/bundles/creators',
    ]);
    expect(map[3]?.alternates?.languages).toEqual({
      en: 'https://x.test/tools/midjourney',
      bg: 'https://x.test/bg/tools/midjourney',
    });
  });

  it('falls back to static routes when readers throw', async () => {
    const fail = async () => {
      throw new Error('offline');
    };
    const map = await buildSitemap({ getTools: fail, getBundles: fail }, site);
    expect(map).toHaveLength(3);
  });
});
