import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getBundle, getPublishedTools } from '@/api/server/catalogue';
import { BundleDetailView } from '@/features/bundles/detail/BundleDetailView';

export const dynamic = 'force-dynamic';

type BundlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BundlePage({ params }: BundlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [bundle, tools] = await Promise.all([getBundle(slug), getPublishedTools()]);
  if (!bundle) notFound();
  return (
    <BundleDetailView
      bundle={bundle}
      tools={tools.filter((tool) => bundle.toolIds.includes(tool.id))}
    />
  );
}
