import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ToolFormView } from '@/features/admin/tool-form/ToolFormView';
import { noindexMetadata } from '@/lib/seo/metadata';

type EditToolPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: EditToolPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('adminTitle'));
}

export default async function EditToolPage({ params }: EditToolPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ToolFormView slug={slug} />;
}
