'use client';

import { Skeleton } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  useAdminBundlesQuery,
  useAdminToolsQuery,
  useSaveBundleMutation,
} from '@/api/endpoints/admin';
import { AdminPage } from '../components/AdminPage/AdminPage';
import { BundleForm } from '../components/BundleForm/BundleForm';
import { QueryNotice } from '../components/QueryNotice/QueryNotice';
import {
  type BundleFormValues,
  defaultBundleFormValues,
  NEW_BUNDLE_SLUG,
} from '../config/bundleForm';
import { buildBundleDocument, bundleToFormValues } from '../utils/bundleDocument';

export type BundleFormViewProps = {
  slug: string;
};

export function BundleFormView({ slug }: BundleFormViewProps) {
  const t = useTranslations('admin');
  const creating = slug === NEW_BUNDLE_SLUG;
  const bundles = useAdminBundlesQuery();
  const tools = useAdminToolsQuery();
  const [save, { error: saveError, isSuccess: saved }] = useSaveBundleMutation();

  const existing = bundles.data?.find((bundle) => bundle.id === slug);
  const initial = useMemo(
    () => (existing ? bundleToFormValues(existing) : defaultBundleFormValues()),
    [existing],
  );
  const toolOptions = useMemo(
    () => (tools.data ?? []).map((tool) => ({ id: tool.id, name: tool.name })),
    [tools.data],
  );

  const onSubmit = async (values: BundleFormValues) => {
    await save({
      slug: values.slug,
      mode: creating ? 'create' : 'update',
      data: buildBundleDocument(values),
    });
  };

  const ready = bundles.isSuccess && tools.isSuccess;
  const missing = ready && !creating && !existing;
  return (
    <AdminPage
      title={creating ? t('bundle.newTitle') : t('bundle.editTitle')}
      backLabel={t('back')}
    >
      <QueryNotice error={bundles.error ?? tools.error} />
      {missing && <QueryNotice error={{ code: 'not-found' }} />}
      {!ready && !bundles.error && !tools.error && <Skeleton shape="card" className="h-64" />}
      {ready && !missing && (
        <BundleForm
          key={slug}
          mode={creating ? 'create' : 'edit'}
          initial={initial}
          tools={toolOptions}
          takenSlugs={bundles.data?.map((bundle) => bundle.id) ?? []}
          error={saveError}
          saved={saved}
          onSubmit={onSubmit}
        />
      )}
    </AdminPage>
  );
}
