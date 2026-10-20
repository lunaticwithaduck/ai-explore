import { setRequestLocale } from 'next-intl/server';
import { getCategories, getPublishedBundles, getPublishedTools } from '@/api/server/catalogue';
import { LibraryView } from '@/features/library/browse/LibraryView';

export const dynamic = 'force-dynamic';

type LibraryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [tools, categories, bundles] = await Promise.all([
    getPublishedTools(),
    getCategories(),
    getPublishedBundles(),
  ]);
  return <LibraryView tools={tools} categories={categories} bundles={bundles} />;
}
