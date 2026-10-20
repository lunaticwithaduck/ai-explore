import type { Locale } from '@ai-explore/schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCategories, getPublishedTools, getTool } from '@/api/server/catalogue';
import { getToolUpdates } from '@/api/server/updates';
import { routes } from '@/config/routes';
import { ToolDetailView } from '@/features/tool/detail/ToolDetailView';
import { pageMetadata, toolMetadataFields } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type ToolPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = await getTool(slug);
  if (!tool) return {};
  const t = await getTranslations({ locale, namespace: 'seo' });
  return pageMetadata({
    path: routes.tool(slug),
    locale: locale as Locale,
    siteName: t('siteName'),
    ...toolMetadataFields(tool, locale as Locale),
  });
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [tools, categories, updates] = await Promise.all([
    getPublishedTools(),
    getCategories(),
    getToolUpdates(slug),
  ]);
  const tool = tools.find((candidate) => candidate.id === slug);
  if (!tool) notFound();
  const pick = (ids: readonly string[]) => tools.filter((candidate) => ids.includes(candidate.id));
  return (
    <ToolDetailView
      tool={tool}
      category={categories.find((category) => category.id === tool.categoryId) ?? null}
      updates={updates}
      similar={pick(tool.similarToolIds)}
      complementary={pick(tool.complementaryToolIds)}
    />
  );
}
