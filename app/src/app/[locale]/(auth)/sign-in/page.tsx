import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SignInView } from '@/features/auth/sign-in/SignInView';
import { noindexMetadata } from '@/lib/seo/metadata';

type SignInPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SignInPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('signInTitle'));
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SignInView />;
}
