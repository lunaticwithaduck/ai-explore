'use client';

import { type Locale, pickLocalized } from '@ai-explore/schemas';
import { Skeleton } from '@ai-explore/ui';
import { skipToken } from '@reduxjs/toolkit/query';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  adminTimestamp,
  useAdminCategoriesQuery,
  useAdminToolQuery,
  useAdminToolsQuery,
  useSaveToolMutation,
} from '@/api/endpoints/admin';
import { AdminPage } from '../components/AdminPage/AdminPage';
import { QueryNotice } from '../components/QueryNotice/QueryNotice';
import { ToolForm } from '../components/ToolForm/ToolForm';
import { defaultToolFormValues, type ToolFormValues } from '../config/toolForm';
import { buildToolDocument, buildToolPatch, toolToFormValues } from '../utils/toolDocument';

export type ToolFormViewProps = {
  slug?: string | undefined;
};

export function ToolFormView({ slug }: ToolFormViewProps) {
  const t = useTranslations('admin');
  const locale = useLocale() as Locale;
  const editing = slug !== undefined;
  const tool = useAdminToolQuery(slug ?? skipToken);
  const tools = useAdminToolsQuery();
  const categories = useAdminCategoriesQuery();
  const [save, { error: saveError, isSuccess: saved }] = useSaveToolMutation();

  const options = useMemo(
    () =>
      (categories.data ?? []).map((category) => ({
        value: category.id,
        label: pickLocalized(category.name, locale),
      })),
    [categories.data, locale],
  );
  const toolOptions = useMemo(
    () => (tools.data ?? []).map((entry) => ({ id: entry.id, name: entry.name })),
    [tools.data],
  );
  const initial = useMemo(
    () => (tool.data ? toolToFormValues(tool.data) : defaultToolFormValues()),
    [tool.data],
  );

  const onSubmit = async (values: ToolFormValues) => {
    const stamp = adminTimestamp();
    const data = editing ? buildToolPatch(values, stamp) : buildToolDocument(values, stamp);
    await save({ slug: values.slug, mode: editing ? 'update' : 'create', data });
  };

  const ready = categories.isSuccess && tools.isSuccess && (!editing || tool.isSuccess);
  const missing = editing && tool.isSuccess && tool.data === null;
  return (
    <AdminPage title={editing ? t('tool.editTitle') : t('tool.newTitle')} backLabel={t('back')}>
      <QueryNotice error={tool.error ?? categories.error ?? tools.error} />
      {missing && <QueryNotice error={{ code: 'not-found' }} />}
      {!ready && !missing && !tool.error && !categories.error && !tools.error && (
        <Skeleton shape="card" className="h-64" />
      )}
      {ready && !missing && (
        <ToolForm
          key={slug ?? 'new'}
          mode={editing ? 'edit' : 'create'}
          initial={initial}
          categories={options}
          tools={toolOptions}
          takenSlugs={tools.data?.map((entry) => entry.id) ?? []}
          error={saveError}
          saved={saved}
          onSubmit={onSubmit}
        />
      )}
    </AdminPage>
  );
}
