import type { MetadataRoute } from 'next';
import { getPublishedBundles, getPublishedTools } from '@/api/server/catalogue';
import { env } from '@/config/env';
import { buildSitemap } from '@/lib/seo/sitemap';

export const dynamic = 'force-dynamic';

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap(
    { getTools: getPublishedTools, getBundles: getPublishedBundles },
    env.NEXT_PUBLIC_SITE_URL,
  );
}
