import { absoluteUrl, alternatesFor, localizedPath } from './alternates';

describe('localizedPath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localizedPath('/', 'en')).toBe('/');
    expect(localizedPath('/tools/midjourney', 'en')).toBe('/tools/midjourney');
  });

  it('prefixes bg', () => {
    expect(localizedPath('/', 'bg')).toBe('/bg');
    expect(localizedPath('/bundles', 'bg')).toBe('/bg/bundles');
    expect(localizedPath('/compare?a=x&b=y', 'bg')).toBe('/bg/compare?a=x&b=y');
  });
});

describe('alternatesFor', () => {
  it('canonicalises the en page to itself', () => {
    expect(alternatesFor('/tools/midjourney', 'en')).toEqual({
      canonical: '/tools/midjourney',
      languages: {
        en: '/tools/midjourney',
        bg: '/bg/tools/midjourney',
        'x-default': '/tools/midjourney',
      },
    });
  });

  it('canonicalises the bg page to its prefixed url', () => {
    const result = alternatesFor('/', 'bg');
    expect(result.canonical).toBe('/bg');
    expect(result.languages.en).toBe('/');
    expect(result.languages.bg).toBe('/bg');
  });
});

describe('absoluteUrl', () => {
  it('resolves against the site url', () => {
    expect(absoluteUrl('/bg/bundles', 'https://example.com')).toBe(
      'https://example.com/bg/bundles',
    );
    expect(absoluteUrl('/', 'https://example.com')).toBe('https://example.com/');
  });
});
