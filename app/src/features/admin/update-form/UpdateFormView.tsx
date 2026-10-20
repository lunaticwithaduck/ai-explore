'use client';

import { Skeleton } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { adminTimestamp, useAdminToolsQuery, useCreateUpdateMutation } from '@/api/endpoints/admin';
import { AdminPage } from '../components/AdminPage/AdminPage';
import { QueryNotice } from '../components/QueryNotice/QueryNotice';
import { UpdateForm } from '../components/UpdateForm/UpdateForm';
import { defaultUpdateFormValues, type UpdateFormValues } from '../config/updateForm';
import { buildUpdateDocument, updateDocumentId } from '../utils/updateDocument';

export type UpdateFormViewProps = Record<string, never>;

export function UpdateFormView(_props: UpdateFormViewProps) {
  const t = useTranslations('admin');
  const tools = useAdminToolsQuery();
  const [create, { error, isSuccess: saved }] = useCreateUpdateMutation();
  const options = useMemo(
    () => (tools.data ?? []).map((tool) => ({ value: tool.id, label: tool.name })),
    [tools.data],
  );

  const onSubmit = async (values: UpdateFormValues) => {
    await create({
      toolId: values.toolId,
      updateId: updateDocumentId(values.version.trim()),
      data: buildUpdateDocument(values, adminTimestamp()),
    });
  };

  return (
    <AdminPage title={t('update.newTitle')} backLabel={t('back')}>
      <QueryNotice error={tools.error} />
      {tools.isLoading && <Skeleton shape="card" className="h-64" />}
      {tools.isSuccess && (
        <UpdateForm
          initial={defaultUpdateFormValues()}
          tools={options}
          error={error}
          saved={saved}
          onSubmit={onSubmit}
        />
      )}
    </AdminPage>
  );
}
