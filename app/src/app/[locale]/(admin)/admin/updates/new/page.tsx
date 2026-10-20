import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { UpdateFormView } from '@/features/admin/update-form/UpdateFormView';
import { noindexMetadata } from '@/lib/seo/metadata';

type NewUpdatePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewUpdatePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('adminTitle'));
}

export default async function NewUpdatePage({ params }: NewUpdatePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UpdateFormView />;
}
