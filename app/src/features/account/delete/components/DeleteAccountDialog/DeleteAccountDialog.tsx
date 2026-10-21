'use client';

import { Button, Dialog } from '@ai-explore/ui';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type SyntheticEvent, useState } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import type { DeleteAccountController } from '../../hooks/useDeleteAccount';
import { ConfirmDeleteForm } from '../ConfirmDeleteForm/ConfirmDeleteForm';
import { DeleteProgress } from '../DeleteProgress/DeleteProgress';
import { FinishDeleteForm } from '../FinishDeleteForm/FinishDeleteForm';

export type DeleteAccountDialogProps = {
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletion: DeleteAccountController;
};

export function DeleteAccountDialog({
  email,
  open,
  onOpenChange,
  deletion,
}: DeleteAccountDialogProps) {
  const t = useTranslations('account');
  const { phase, method, busy, confirm, finish, cancel } = deletion;
  const [typed, setTyped] = useState('');
  const finishing = phase.name === 'finish';

  const changeOpen = (next: boolean) => {
    if (busy) return;
    if (!next) {
      cancel();
      setTyped('');
    }
    onOpenChange(next);
  };

  const holdWhileBusy = (event: SyntheticEvent | Event) => {
    if (busy) event.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={changeOpen}
      onEscapeKeyDown={holdWhileBusy}
      onInteractOutside={holdWhileBusy}
      title={t(finishing ? 'delete.finish.title' : 'delete.dialog.title')}
      description={t(finishing ? 'delete.finish.description' : 'delete.dialog.description')}
      closeLabel={t('delete.dialog.close')}
      trigger={
        <Button variant="danger" iconLeft={Trash2} data-testid={TEST_IDS.account.deleteAccount}>
          {t('delete.button')}
        </Button>
      }
    >
      {phase.name === 'confirm' && (
        <ConfirmDeleteForm
          email={email}
          typed={typed}
          onTypedChange={setTyped}
          method={method}
          pending={phase.pending}
          error={phase.error}
          onCancel={() => changeOpen(false)}
          onConfirm={(password) => void confirm(password)}
        />
      )}
      {phase.name === 'finish' && (
        <FinishDeleteForm
          method={method}
          pending={phase.pending}
          error={phase.error}
          onSubmit={(password) => void finish(password)}
          onCancel={() => changeOpen(false)}
        />
      )}
      {phase.name === 'running' && <DeleteProgress step={phase.step} />}
    </Dialog>
  );
}
