import { setRequestLocale } from 'next-intl/server';
import { getPublishedTools } from '@/api/server/catalogue';
import { MyLibraryView } from '@/features/my-library/library/MyLibraryView';

export const dynamic = 'force-dynamic';

type MyLibraryPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MyLibraryPage({ params }: MyLibraryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tools = await getPublishedTools();
  return <MyLibraryView tools={tools} />;
}
