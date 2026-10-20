import type { Locale } from '@ai-explore/schemas';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPublishedTools } from '@/api/server/catalogue';
import { routes } from '@/config/routes';
import { CompareView } from '@/features/compare/compare/CompareView';
import { pageMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type ComparePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ a?: string | string[]; b?: string | string[] }>;
};

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({
  params,
  searchParams,
}: ComparePageProps): Promise<Metadata> {
  const { locale } = await params;
  const { a, b } = await searchParams;
  const first = single(a);
  const second = single(b);
  const [t, tools] = await Promise.all([
    getTranslations({ locale, namespace: 'seo' }),
    getPublishedTools().catch(() => []),
  ]);
  const firstName = tools.find((tool) => tool.id === first)?.name;
  const secondName = tools.find((tool) => tool.id === second)?.name;
  const both = firstName && secondName ? { first: firstName, second: secondName } : null;
  return pageMetadata({
    path: both ? routes.compare(first, second) : routes.compare(),
    locale: locale as Locale,
    title: both ? t('compareTools', both) : t('compareTitle'),
    description: both ? t('compareToolsDescription', both) : t('compareDescription'),
    siteName: t('siteName'),
  });
}

export default async function ComparePage({ params, searchParams }: ComparePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [{ a, b }, tools] = await Promise.all([searchParams, getPublishedTools()]);
  return <CompareView tools={tools} firstId={single(a)} secondId={single(b)} />;
}
