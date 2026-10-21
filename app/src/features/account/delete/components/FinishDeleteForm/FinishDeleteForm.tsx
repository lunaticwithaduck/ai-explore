'use client';

import { Button, Text } from '@ai-explore/ui';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { AuthAlert } from '@/features/auth/components/AuthAlert/AuthAlert';
import { AuthField } from '@/features/auth/components/AuthField/AuthField';
import { useDeleteErrorMessage } from '../../hooks/useDeleteErrorMessage';
import type { DeleteError } from '../../utils/deleteErrors';
import type { ReauthMethod } from '../../utils/reauth';
import { finishDeleteFormStyles as styles } from './FinishDeleteForm.styles';

export type FinishDeleteFormProps = {
  method: ReauthMethod;
  pending: boolean;
  error: DeleteError | null;
  onSubmit: (password: string | null) => void;
  onCancel: () => void;
};

export function FinishDeleteForm({
  method,
  pending,
  error,
  onSubmit,
  onCancel,
}: FinishDeleteFormProps) {
  const t = useTranslations('account');
  const errorMessage = useDeleteErrorMessage();
  const [password, setPassword] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const needsPassword = method === 'password';
  const ready = !needsPassword || password.length > 0;

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ready && !pending) onSubmit(needsPassword ? password : null);
  };

  return (
    <form noValidate onSubmit={submit} className={styles.form}>
      <div className={styles.notice}>
        <CircleAlert aria-hidden className={styles.icon} />
        <Text size="sm">{t(`delete.finish.${method}`)}</Text>
      </div>
      {needsPassword && (
        <AuthField
          ref={passwordRef}
          id="delete-account-finish-password"
          type="password"
          autoComplete="current-password"
          label={t('delete.dialog.passwordLabel')}
          value={password}
          disabled={pending}
          onChange={(event) => setPassword(event.target.value)}
        />
      )}
      {error && <AuthAlert message={errorMessage(error)} />}
      <div className={styles.actions}>
        <Button variant="secondary" disabled={pending} onClick={onCancel}>
          {t('delete.dialog.cancel')}
        </Button>
        <Button type="submit" variant="danger" loading={pending} disabled={!ready}>
          {t(needsPassword ? 'delete.finish.submitPassword' : 'delete.finish.submitGoogle')}
        </Button>
      </div>
    </form>
  );
}
