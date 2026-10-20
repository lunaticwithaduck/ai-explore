import { setRequestLocale } from 'next-intl/server';
import { getPublishedTools } from '@/api/server/catalogue';
import { CompareView } from '@/features/compare/compare/CompareView';

export const dynamic = 'force-dynamic';

type ComparePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ a?: string | string[]; b?: string | string[] }>;
};

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function ComparePage({ params, searchParams }: ComparePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [{ a, b }, tools] = await Promise.all([searchParams, getPublishedTools()]);
  return <CompareView tools={tools} firstId={single(a)} secondId={single(b)} />;
}
