import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCategories, getPublishedTools } from '@/api/server/catalogue';
import { getToolUpdates } from '@/api/server/updates';
import { ToolDetailView } from '@/features/tool/detail/ToolDetailView';

export const dynamic = 'force-dynamic';

type ToolPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

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
