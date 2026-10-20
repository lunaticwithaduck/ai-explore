import type { MetadataRoute } from 'next';
import { routes } from '@/config/routes';
import { absoluteUrl } from './alternates';

const PRIVATE_PATHS = [routes.admin, routes.myLibrary, routes.profile, routes.settings, '/ui'];

export function buildRobots(siteUrl: string): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: PRIVATE_PATHS.flatMap((path) => [path, `/bg${path}`]),
    },
    sitemap: absoluteUrl('/sitemap.xml', siteUrl),
  };
}
