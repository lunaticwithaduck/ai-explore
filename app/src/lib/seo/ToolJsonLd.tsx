import type { Locale, Tool, WithId } from '@ai-explore/schemas';
import { getLocale } from 'next-intl/server';
import { buildToolJsonLd, serializeJsonLd } from './jsonLd';

type ToolJsonLdProps = {
  tool: WithId<Tool>;
};

export async function ToolJsonLd({ tool }: ToolJsonLdProps) {
  const locale = (await getLocale()) as Locale;
  const html = { __html: serializeJsonLd(buildToolJsonLd(tool, locale)) };
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD with < escaped by serializeJsonLd
    <script type="application/ld+json" dangerouslySetInnerHTML={html} />
  );
}
