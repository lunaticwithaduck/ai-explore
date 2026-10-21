'use client';

import { Skeleton } from '@ai-explore/ui';
import { skipToken } from '@reduxjs/toolkit/query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  adminTimestamp,
  useAdminToolsQuery,
  useAdminUpdateQuery,
  useCreateUpdateMutation,
} from '@/api/endpoints/admin';
import { AdminPage } from '../components/AdminPage/AdminPage';
import { QueryNotice } from '../components/QueryNotice/QueryNotice';
import { UpdateForm } from '../components/UpdateForm/UpdateForm';
import { defaultUpdateFormValues, type UpdateFormValues } from '../config/updateForm';
import {
  buildUpdateDocument,
  buildUpdatePatch,
  updateDocumentId,
  updateToFormValues,
} from '../utils/updateDocument';

export type UpdateFormViewProps = {
  toolId?: string | undefined;
  updateId?: string | undefined;
};

export function UpdateFormView({ toolId, updateId }: UpdateFormViewProps) {
  const t = useTranslations('admin');
  const editing = toolId !== undefined && updateId !== undefined;
  const tools = useAdminToolsQuery();
  const existing = useAdminUpdateQuery(editing ? { toolId, updateId } : skipToken);
  const [save, { error, isSuccess: saved }] = useCreateUpdateMutation();
  const options = useMemo(
    () => (tools.data ?? []).map((tool) => ({ value: tool.id, label: tool.name })),
    [tools.data],
  );
  const initial = useMemo(
    () => (existing.data ? updateToFormValues(existing.data) : defaultUpdateFormValues()),
    [existing.data],
  );

  const onSubmit = async (values: UpdateFormValues) => {
    if (editing) {
      await save({ mode: 'update', toolId, updateId, data: buildUpdatePatch(values) });
      return;
    }
    await save({
      toolId: values.toolId,
      updateId: updateDocumentId(values.version.trim()),
      data: buildUpdateDocument(values, adminTimestamp()),
    });
  };

  const ready = tools.isSuccess && (!editing || existing.isSuccess);
  const missing = editing && existing.isSuccess && existing.data === null;
  const failure = tools.error ?? existing.error;
  return (
    <AdminPage title={editing ? t('update.editTitle') : t('update.newTitle')} backLabel={t('back')}>
      <QueryNotice error={failure} />
      {missing && <QueryNotice error={{ code: 'not-found' }} />}
      {!ready && !missing && !failure && <Skeleton shape="card" className="h-64" />}
      {ready && !missing && (
        <UpdateForm
          key={editing ? `${toolId}/${updateId}` : 'new'}
          mode={editing ? 'edit' : 'create'}
          initial={initial}
          tools={options}
          error={error}
          saved={saved}
          onSubmit={onSubmit}
        />
      )}
    </AdminPage>
  );
}
