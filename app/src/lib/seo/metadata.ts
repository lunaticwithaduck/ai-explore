import type { Bundle, Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import type { Metadata } from 'next';
import { env } from '@/config/env';
import { absoluteUrl, alternatesFor } from './alternates';

export const NOINDEX: Metadata['robots'] = { index: false, follow: false };

export function siteMetadataBase(): URL {
  return new URL(env.NEXT_PUBLIC_SITE_URL);
}

type PageMetadataInput = {
  path: string;
  locale: Locale;
  title: string;
  description: string;
  image?: string | undefined;
  siteName: string;
};

export function pageMetadata({
  path,
  locale,
  title,
  description,
  image,
  siteName,
}: PageMetadataInput): Metadata {
  const alternates = alternatesFor(path, locale);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      siteName,
      locale,
      url: alternates.canonical,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description },
  };
}

export function toolMetadataFields(tool: WithId<Tool>, locale: Locale) {
  return {
    title: tool.name,
    description: pickLocalized(tool.tagline, locale),
    image: absoluteUrl(tool.logo.path),
  };
}

export function bundleMetadataFields(bundle: WithId<Bundle>, locale: Locale) {
  return {
    title: pickLocalized(bundle.name, locale),
    description: pickLocalized(bundle.description, locale),
  };
}

export function noindexMetadata(title?: string): Metadata {
  return { ...(title ? { title } : {}), robots: NOINDEX };
}
