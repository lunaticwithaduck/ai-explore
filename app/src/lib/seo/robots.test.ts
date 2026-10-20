import { buildRobots } from './robots';

describe('buildRobots', () => {
  it('allows root, blocks private paths in both locales and links the sitemap', () => {
    const robots = buildRobots('https://x.test');
    const rules = robots.rules as { allow: string; disallow: string[] };
    expect(rules.allow).toBe('/');
    expect(rules.disallow).toEqual(
      expect.arrayContaining([
        '/admin',
        '/bg/admin',
        '/library',
        '/bg/profile',
        '/settings',
        '/ui',
        '/bg/ui',
      ]),
    );
    expect(robots.sitemap).toBe('https://x.test/sitemap.xml');
  });
});
