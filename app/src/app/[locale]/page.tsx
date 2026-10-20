import { setRequestLocale } from 'next-intl/server';
import { LibraryView } from '@/features/library/browse/LibraryView';

type LibraryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LibraryView />;
}
