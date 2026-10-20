import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SignUpView } from '@/features/auth/sign-up/SignUpView';
import { noindexMetadata } from '@/lib/seo/metadata';

type SignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SignUpPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return noindexMetadata(t('signUpTitle'));
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SignUpView />;
}
