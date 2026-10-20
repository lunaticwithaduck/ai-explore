import type { Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { averageRating } from '@/lib/format/rating';
import { absoluteUrl, localizedPath } from './alternates';

export type ToolJsonLdObject = {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  url: string;
  image: string;
  offers?: { '@type': 'Offer'; price: string; priceCurrency: 'USD' };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    ratingCount: number;
    bestRating: 5;
    worstRating: 1;
  };
};

const decimal = (cents: number) => (cents / 100).toFixed(2);

export function buildToolJsonLd(
  tool: WithId<Tool>,
  locale: Locale,
  siteUrl?: string,
): ToolJsonLdObject {
  const average = averageRating(tool.rating);
  const price = tool.pricing.hasFreePlan ? 0 : tool.pricing.fromPriceCents;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: pickLocalized(tool.tagline, locale),
    applicationCategory: tool.categoryId,
    url: absoluteUrl(localizedPath(`/tools/${encodeURIComponent(tool.id)}`, locale), siteUrl),
    image: absoluteUrl(tool.logo.path, siteUrl),
    ...(price === undefined
      ? {}
      : { offers: { '@type': 'Offer', price: decimal(price), priceCurrency: 'USD' } }),
    ...(average === null
      ? {}
      : {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: average,
            ratingCount: tool.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }),
  } as ToolJsonLdObject;
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
