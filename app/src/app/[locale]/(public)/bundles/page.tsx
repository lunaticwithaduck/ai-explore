import { setRequestLocale } from 'next-intl/server';
import { getPublishedBundles, getPublishedTools } from '@/api/server/catalogue';
import { BundleListView } from '@/features/bundles/list/BundleListView';

export const dynamic = 'force-dynamic';

type BundlesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BundlesPage({ params }: BundlesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [bundles, tools] = await Promise.all([getPublishedBundles(), getPublishedTools()]);
  return <BundleListView bundles={bundles} tools={tools} />;
}
