'use client';

import { UPDATE_KINDS } from '@ai-explore/schemas';
import { Button, Card } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { type UpdateFormValues, updateFormSchema } from '../../config/updateForm';
import { AdminSelectField } from '../AdminSelectField/AdminSelectField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { ChangeRows } from '../ChangeRows/ChangeRows';
import { QueryNotice } from '../QueryNotice/QueryNotice';
import { SavedNotice } from '../SavedNotice/SavedNotice';
import { updateFormStyles } from './UpdateForm.styles';

export type UpdateFormProps = {
  initial: UpdateFormValues;
  tools: readonly { value: string; label: string }[];
  error: unknown;
  saved: boolean;
  onSubmit: (values: UpdateFormValues) => Promise<void>;
};

export function UpdateForm({ initial, tools, error, saved, onSubmit }: UpdateFormProps) {
  const t = useTranslations('admin');
  const methods = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: initial,
  });
  const kinds = UPDATE_KINDS.map((value) => ({ value, label: t(`update.kinds.${value}`) }));
  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)} className={updateFormStyles.form}>
        <Card padding="md" className={updateFormStyles.card}>
          <div className={updateFormStyles.grid}>
            <AdminSelectField
              name="toolId"
              label={t('update.tool')}
              options={tools}
              placeholder={t('update.toolPlaceholder')}
            />
            <AdminTextField name="version" label={t('update.version')} />
            <AdminSelectField name="kind" label={t('update.kind')} options={kinds} />
            <AdminTextField name="title.en" label={t('update.titleEn')} />
            <AdminTextField name="title.bg" label={t('update.titleBg')} />
          </div>
          <ChangeRows />
        </Card>
        <QueryNotice error={error} />
        <SavedNotice saved={saved} />
        <div className={updateFormStyles.footer}>
          <Button
            type="submit"
            iconLeft={Save}
            loading={methods.formState.isSubmitting}
            disabled={methods.formState.isSubmitting}
          >
            {t('update.save')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
