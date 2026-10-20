import { setRequestLocale } from 'next-intl/server';
import { SettingsView } from '@/features/account/settings/SettingsView';

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SettingsView />;
}
