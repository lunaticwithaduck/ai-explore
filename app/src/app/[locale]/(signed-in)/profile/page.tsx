import { setRequestLocale } from 'next-intl/server';
import { getPublishedTools } from '@/api/server/catalogue';
import { ProfileView } from '@/features/account/profile/ProfileView';

export const dynamic = 'force-dynamic';

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tools = await getPublishedTools();
  return <ProfileView tools={tools} />;
}
