'use client';

import { Button, Text } from '@ai-explore/ui';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { AuthAlert } from '@/features/auth/components/AuthAlert/AuthAlert';
import { AuthField } from '@/features/auth/components/AuthField/AuthField';
import { useDeleteErrorMessage } from '../../hooks/useDeleteErrorMessage';
import type { DeleteError } from '../../utils/deleteErrors';
import type { ReauthMethod } from '../../utils/reauth';
import { DeleteSummary } from '../DeleteSummary/DeleteSummary';
import { confirmDeleteFormStyles as styles } from './ConfirmDeleteForm.styles';

export type ConfirmDeleteFormProps = {
  email: string;
  typed: string;
  onTypedChange: (value: string) => void;
  method: ReauthMethod;
  pending: boolean;
  error: DeleteError | null;
  onCancel: () => void;
  onConfirm: (password: string | null) => void;
};

const sameEmail = (typed: string, email: string) =>
  email.length > 0 && typed.trim().toLowerCase() === email.trim().toLowerCase();

export function ConfirmDeleteForm({
  email,
  typed,
  onTypedChange,
  method,
  pending,
  error,
  onCancel,
  onConfirm,
}: ConfirmDeleteFormProps) {
  const t = useTranslations('account');
  const errorMessage = useDeleteErrorMessage();
  const [password, setPassword] = useState('');
  const needsPassword = method === 'password';
  const ready = sameEmail(typed, email) && (!needsPassword || password.length > 0);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ready && !pending) onConfirm(needsPassword ? password : null);
  };

  return (
    <form noValidate onSubmit={submit} className={styles.form}>
      <DeleteSummary />
      <div className={styles.fields}>
        <AuthField
          id="delete-account-email"
          type="email"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          label={t('delete.dialog.emailLabel', { email })}
          value={typed}
          disabled={pending}
          onChange={(event) => onTypedChange(event.target.value)}
        />
        {needsPassword ? (
          <AuthField
            id="delete-account-password"
            type="password"
            autoComplete="current-password"
            label={t('delete.dialog.passwordLabel')}
            value={password}
            disabled={pending}
            onChange={(event) => setPassword(event.target.value)}
          />
        ) : (
          <Text size="sm" tone="muted">
            {t('delete.dialog.googleHint')}
          </Text>
        )}
      </div>
      {error && <AuthAlert message={errorMessage(error)} />}
      <div className={styles.actions}>
        <Button variant="secondary" disabled={pending} onClick={onCancel}>
          {t('delete.dialog.cancel')}
        </Button>
        <Button
          type="submit"
          variant="danger"
          iconLeft={Trash2}
          loading={pending}
          disabled={!ready}
          data-testid={TEST_IDS.account.confirmDelete}
        >
          {t('delete.dialog.confirm')}
        </Button>
      </div>
    </form>
  );
}
