import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AdminView } from '@/features/admin/dashboard/AdminView';
import { noindexMetadata } from '@/lib/seo/metadata';

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AdminPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('adminTitle'));
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminView />;
}
