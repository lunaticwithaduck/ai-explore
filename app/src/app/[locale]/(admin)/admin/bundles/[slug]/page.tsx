import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BundleFormView } from '@/features/admin/bundle-form/BundleFormView';
import { noindexMetadata } from '@/lib/seo/metadata';

type AdminBundlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: AdminBundlePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('adminTitle'));
}

export default async function AdminBundlePage({ params }: AdminBundlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <BundleFormView slug={slug} />;
}
