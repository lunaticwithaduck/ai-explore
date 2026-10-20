import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ToolFormView } from '@/features/admin/tool-form/ToolFormView';
import { noindexMetadata } from '@/lib/seo/metadata';

type NewToolPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewToolPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('adminTitle'));
}

export default async function NewToolPage({ params }: NewToolPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ToolFormView />;
}
