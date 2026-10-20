import { setRequestLocale } from 'next-intl/server';
import { SignInView } from '@/features/auth/sign-in/SignInView';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SignInView />;
}
