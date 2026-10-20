import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { StoreProvider } from '@/api/StoreProvider';
import { routing } from '@/i18n/routing';
import { FeatureFlagProvider } from '@/lib/feature-flags/FeatureFlagProvider';
import { loadFlags } from '@/lib/feature-flags/loadFlags';
import { siteMetadataBase } from '@/lib/seo/metadata';
import { AppShell } from '@/shell/AppShell/AppShell';
import '../globals.css';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'seo' });
  return {
    metadataBase: siteMetadataBase(),
    title: { default: t('siteName'), template: `%s · ${t('siteName')}` },
    description: t('defaultDescription'),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [messages, flags] = await Promise.all([getMessages(), loadFlags()]);

  return (
    <html lang={locale} className="dark">
      <body className="min-h-dvh bg-surface text-text antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <FeatureFlagProvider flags={flags}>
              <AppShell>{children}</AppShell>
            </FeatureFlagProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
