import { getTranslations } from 'next-intl/server';
import { NotFoundContent } from '@/features/system/not-found/NotFoundContent';
import './globals.css';

export default async function RootNotFound() {
  const t = await getTranslations({ locale: 'en', namespace: 'system' });
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh bg-surface text-text antialiased">
        <NotFoundContent title={t('notFoundTitle')} body={t('notFoundBody')} action={t('goHome')} />
      </body>
    </html>
  );
}
