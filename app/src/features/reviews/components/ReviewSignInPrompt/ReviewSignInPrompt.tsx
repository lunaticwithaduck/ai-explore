'use client';

import { Button, Text } from '@ai-explore/ui';
import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { signInHref } from '@/features/auth/utils/nextParam';
import { Link, usePathname } from '@/i18n/navigation';
import { reviewSignInPromptStyles as styles } from './ReviewSignInPrompt.styles';

export function ReviewSignInPrompt() {
  const t = useTranslations('reviews.signIn');
  const pathname = usePathname();
  return (
    <div className={styles.root}>
      <Text size="sm" tone="muted">
        {t('prompt')}
      </Text>
      <Button asChild variant="secondary" size="sm" iconLeft={LogIn}>
        <Link href={signInHref(pathname)}>{t('action')}</Link>
      </Button>
    </div>
  );
}
