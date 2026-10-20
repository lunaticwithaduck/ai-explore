import { setRequestLocale } from 'next-intl/server';
import { ResetPasswordView } from '@/features/auth/reset-password/ResetPasswordView';

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ResetPasswordView />;
}
