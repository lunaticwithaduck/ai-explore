import type { Locale } from '@ai-explore/schemas';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPublishedBundles, getPublishedTools } from '@/api/server/catalogue';
import { routes } from '@/config/routes';
import { BundleListView } from '@/features/bundles/list/BundleListView';
import { pageMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type BundlesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BundlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return pageMetadata({
    path: routes.bundles,
    locale: locale as Locale,
    title: t('bundlesTitle'),
    description: t('bundlesDescription'),
    siteName: t('siteName'),
  });
}

export default async function BundlesPage({ params }: BundlesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [bundles, tools] = await Promise.all([getPublishedBundles(), getPublishedTools()]);
  return <BundleListView bundles={bundles} tools={tools} />;
}
