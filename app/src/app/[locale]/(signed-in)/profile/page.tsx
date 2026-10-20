import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPublishedTools } from '@/api/server/catalogue';
import { ProfileView } from '@/features/account/profile/ProfileView';
import { noindexMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('profileTitle'));
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tools = await getPublishedTools();
  return <ProfileView tools={tools} />;
}
