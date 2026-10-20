'use client';

import { Button, Heading, Text } from '@ai-explore/ui';
import { Home, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { errorViewStyles } from './ErrorView.styles';

export type ErrorViewProps = {
  onRetry: () => void;
};

export function ErrorView({ onRetry }: ErrorViewProps) {
  const t = useTranslations('system');
  return (
    <main className={errorViewStyles.page}>
      <Heading level={1}>{t('errorTitle')}</Heading>
      <Text tone="muted">{t('errorBody')}</Text>
      <div className={errorViewStyles.actions}>
        <Button iconLeft={RotateCcw} onClick={onRetry}>
          {t('retry')}
        </Button>
        <Button asChild variant="secondary" iconLeft={Home}>
          <Link href={routes.library}>{t('goHome')}</Link>
        </Button>
      </div>
    </main>
  );
}
