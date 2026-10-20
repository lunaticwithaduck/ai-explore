import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import type { MetadataRoute } from 'next';
import { routes } from '@/config/routes';
import { absoluteUrl, localizedPath } from './alternates';

export type SitemapReaders = {
  getTools: () => Promise<WithId<Tool>[]>;
  getBundles: () => Promise<WithId<Bundle>[]>;
};

const entry = (path: string, siteUrl: string): MetadataRoute.Sitemap[number] => ({
  url: absoluteUrl(localizedPath(path, 'en'), siteUrl),
  alternates: {
    languages: {
      en: absoluteUrl(localizedPath(path, 'en'), siteUrl),
      bg: absoluteUrl(localizedPath(path, 'bg'), siteUrl),
    },
  },
});

async function safely<T>(read: () => Promise<T[]>): Promise<T[]> {
  try {
    return await read();
  } catch {
    return [];
  }
}

export async function buildSitemap(
  readers: SitemapReaders,
  siteUrl: string,
): Promise<MetadataRoute.Sitemap> {
  const [tools, bundles] = await Promise.all([
    safely(readers.getTools),
    safely(readers.getBundles),
  ]);
  const paths = [
    routes.library,
    routes.bundles,
    routes.compare(),
    ...tools.map((tool) => routes.tool(tool.id)),
    ...bundles.map((bundle) => routes.bundle(bundle.id)),
  ];
  return paths.map((path) => entry(path, siteUrl));
}
