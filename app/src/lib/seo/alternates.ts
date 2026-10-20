import type { Locale } from '@ai-explore/schemas';
import { env } from '@/config/env';
import { routing } from '@/i18n/routing';

export type Alternates = {
  canonical: string;
  languages: Record<Locale | 'x-default', string>;
};

export function localizedPath(path: string, locale: Locale): string {
  if (locale === routing.defaultLocale) return path;
  if (path === '/') return `/${locale}`;
  if (path.startsWith('/?')) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

export function absoluteUrl(path: string, siteUrl: string = env.NEXT_PUBLIC_SITE_URL): string {
  return new URL(path, siteUrl).toString();
}

export function alternatesFor(path: string, locale: Locale): Alternates {
  const en = localizedPath(path, 'en');
  const bg = localizedPath(path, 'bg');
  return {
    canonical: localizedPath(path, locale),
    languages: { en, bg, 'x-default': en },
  };
}
