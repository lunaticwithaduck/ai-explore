import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { UpdateFormView } from '@/features/admin/update-form/UpdateFormView';
import { noindexMetadata } from '@/lib/seo/metadata';

type EditUpdatePageProps = {
  params: Promise<{ locale: string; toolId: string; updateId: string }>;
};

export async function generateMetadata({ params }: EditUpdatePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('adminTitle'));
}

export default async function EditUpdatePage({ params }: EditUpdatePageProps) {
  const { locale, toolId, updateId } = await params;
  setRequestLocale(locale);
  return <UpdateFormView toolId={toolId} updateId={updateId} />;
}
