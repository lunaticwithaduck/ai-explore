import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import {
  bundleMetadataFields,
  NOINDEX,
  noindexMetadata,
  pageMetadata,
  toolMetadataFields,
} from './metadata';

const tool = {
  id: 'midjourney',
  name: 'Midjourney',
  tagline: { en: 'Images', bg: 'Изображения' },
  logo: { path: '/logos/midjourney.png', background: '#000000' },
} as unknown as WithId<Tool>;

const bundle = {
  id: 'creators',
  name: { en: 'Creators', bg: 'Творци' },
  description: { en: 'For makers', bg: 'За творци' },
} as unknown as WithId<Bundle>;

describe('pageMetadata', () => {
  it('sets canonical, languages and og image', () => {
    const meta = pageMetadata({
      path: '/tools/midjourney',
      locale: 'bg',
      title: 'Midjourney',
      description: 'd',
      image: 'https://x.test/logos/m.png',
      siteName: 'AI Explore',
    });
    expect(meta.alternates?.canonical).toBe('/bg/tools/midjourney');
    expect(meta.alternates?.languages).toMatchObject({ en: '/tools/midjourney' });
    expect(meta.openGraph?.images).toEqual([{ url: 'https://x.test/logos/m.png' }]);
  });
});

describe('field helpers', () => {
  it('localises tool fields with an absolute logo url', () => {
    const fields = toolMetadataFields(tool, 'bg');
    expect(fields.title).toBe('Midjourney');
    expect(fields.description).toBe('Изображения');
    expect(fields.image).toMatch(/^https?:\/\/.+\/logos\/midjourney\.png$/);
  });

  it('localises bundle fields', () => {
    expect(bundleMetadataFields(bundle, 'bg')).toEqual({
      title: 'Творци',
      description: 'За творци',
    });
    expect(bundleMetadataFields(bundle, 'en').title).toBe('Creators');
  });

  it('marks noindex', () => {
    expect(noindexMetadata('Admin').robots).toBe(NOINDEX);
  });
});
