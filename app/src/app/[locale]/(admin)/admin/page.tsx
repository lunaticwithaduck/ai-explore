import { setRequestLocale } from 'next-intl/server';
import { AdminView } from '@/features/admin/dashboard/AdminView';

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminView />;
}
