import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PrimitivesView } from '@/features/dev/primitives/PrimitivesView';

type PrimitivesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrimitivesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dev' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function PrimitivesPage({ params }: PrimitivesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrimitivesView />;
}
