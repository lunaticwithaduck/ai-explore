'use client';

import { Button, Text } from '@ai-explore/ui';
import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { signInRemainsAlertStyles as styles } from './SignInRemainsAlert.styles';

export type SignInRemainsAlertProps = {
  onFinish: () => void;
};

export function SignInRemainsAlert({ onFinish }: SignInRemainsAlertProps) {
  const t = useTranslations('account');
  return (
    <div role="alert" className={styles.root}>
      <TriangleAlert aria-hidden className={styles.icon} />
      <div className={styles.copy}>
        <Text size="sm" weight="medium">
          {t('delete.remains.title')}
        </Text>
        <Text size="sm" tone="muted">
          {t('delete.remains.body')}
        </Text>
      </div>
      <Button variant="danger" className={styles.action} onClick={onFinish}>
        {t('delete.remains.action')}
      </Button>
    </div>
  );
}
