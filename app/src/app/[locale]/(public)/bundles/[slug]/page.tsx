import type { Locale } from '@ai-explore/schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getBundle, getPublishedTools } from '@/api/server/catalogue';
import { routes } from '@/config/routes';
import { BundleDetailView } from '@/features/bundles/detail/BundleDetailView';
import { bundleMetadataFields, pageMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type BundlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: BundlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const bundle = await getBundle(slug);
  if (!bundle) return {};
  const t = await getTranslations({ locale, namespace: 'seo' });
  return pageMetadata({
    path: routes.bundle(slug),
    locale: locale as Locale,
    siteName: t('siteName'),
    ...bundleMetadataFields(bundle, locale as Locale),
  });
}

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
