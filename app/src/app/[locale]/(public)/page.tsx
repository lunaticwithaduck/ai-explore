import type { Locale } from '@ai-explore/schemas';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCategories, getPublishedBundles, getPublishedTools } from '@/api/server/catalogue';
import { routes } from '@/config/routes';
import { LibraryView } from '@/features/library/browse/LibraryView';
import { pageMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type LibraryPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LibraryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return pageMetadata({
    path: routes.library,
    locale: locale as Locale,
    title: t('libraryTitle'),
    description: t('libraryDescription'),
    siteName: t('siteName'),
  });
}

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
