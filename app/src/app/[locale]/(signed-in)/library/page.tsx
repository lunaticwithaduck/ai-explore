import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPublishedTools } from '@/api/server/catalogue';
import { MyLibraryView } from '@/features/my-library/library/MyLibraryView';
import { noindexMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type MyLibraryPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MyLibraryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('myLibraryTitle'));
}

export default async function MyLibraryPage({ params }: MyLibraryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tools = await getPublishedTools();
  return <MyLibraryView tools={tools} />;
}
