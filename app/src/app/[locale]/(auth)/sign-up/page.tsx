import { setRequestLocale } from 'next-intl/server';
import { SignUpView } from '@/features/auth/sign-up/SignUpView';

type SignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SignUpView />;
}
