'use client';

import type { SelectOption } from '@ai-explore/ui';
import { Button, Card, Heading } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { adminToolField, TEST_IDS } from '@/config/test-ids';
import { type ToolFormValues, toolFormSchema } from '../../config/toolForm';
import { AdminSelectField } from '../AdminSelectField/AdminSelectField';
import { AdminSwitchField } from '../AdminSwitchField/AdminSwitchField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { QueryNotice } from '../QueryNotice/QueryNotice';
import { SavedNotice } from '../SavedNotice/SavedNotice';
import { ToolListRows } from '../ToolListRows/ToolListRows';
import { ToolPlanRows } from '../ToolPlanRows/ToolPlanRows';
import { toolFormStyles } from './ToolForm.styles';

export type ToolFormProps = {
  mode: 'create' | 'edit';
  initial: ToolFormValues;
  categories: readonly SelectOption[];
  takenSlugs: readonly string[];
  error: unknown;
  saved: boolean;
  onSubmit: (values: ToolFormValues) => Promise<void>;
};

export function ToolForm({
  mode,
  initial,
  categories,
  takenSlugs,
  error,
  saved,
  onSubmit,
}: ToolFormProps) {
  const t = useTranslations('admin');
  const methods = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: initial,
  });
  const submit = methods.handleSubmit(async (values) => {
    if (mode === 'create' && takenSlugs.includes(values.slug)) {
      methods.setError('slug', { type: 'taken' });
      return;
    }
    await onSubmit(values);
  });
  const field = (name: string) => adminToolField(name);
  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit} className={toolFormStyles.form}>
        <Card padding="md" className={toolFormStyles.card}>
          <Heading level={2} size="sm">
            {t('tool.basics')}
          </Heading>
          <div className={toolFormStyles.grid}>
            {mode === 'create' && (
              <AdminTextField name="slug" label={t('tool.slug')} testId={field('slug')} />
            )}
            <AdminTextField name="name" label={t('tool.name')} testId={field('name')} />
            <AdminTextField
              name="developer"
              label={t('tool.developer')}
              testId={field('developer')}
            />
            <AdminTextField
              name="websiteUrl"
              label={t('tool.websiteUrl')}
              inputType="url"
              testId={field('websiteUrl')}
            />
            <AdminSelectField
              name="categoryId"
              label={t('tool.category')}
              options={categories}
              placeholder={t('tool.categoryPlaceholder')}
              testId={field('categoryId')}
            />
            <AdminTextField
              name="tagline.en"
              label={t('tool.taglineEn')}
              testId={field('tagline.en')}
            />
            <AdminTextField
              name="tagline.bg"
              label={t('tool.taglineBg')}
              testId={field('tagline.bg')}
            />
            <AdminTextField
              multiline
              name="description.en"
              label={t('tool.descriptionEn')}
              testId={field('description.en')}
            />
            <AdminTextField
              multiline
              name="description.bg"
              label={t('tool.descriptionBg')}
              testId={field('description.bg')}
            />
            <AdminTextField
              name="logo.path"
              label={t('tool.logoPath')}
              testId={field('logo.path')}
            />
            <AdminTextField
              name="logo.background"
              label={t('tool.logoBackground')}
              testId={field('logo.background')}
            />
          </div>
        </Card>
        <Card padding="md" className={toolFormStyles.card}>
          <Heading level={2} size="sm">
            {t('tool.pricing')}
          </Heading>
          <div className={toolFormStyles.grid}>
            <AdminSwitchField
              name="pricing.hasFreePlan"
              label={t('tool.hasFreePlan')}
              testId={field('pricing.hasFreePlan')}
            />
            <AdminTextField
              numeric
              name="pricing.trialDays"
              label={t('tool.trialDays')}
              testId={field('pricing.trialDays')}
            />
          </div>
          <ToolPlanRows />
        </Card>
        <Card padding="md" className={toolFormStyles.card}>
          <ToolListRows />
        </Card>
        <QueryNotice error={error} />
        <SavedNotice saved={saved} />
        <div className={toolFormStyles.footer}>
          <AdminSwitchField
            name="published"
            label={t('tool.published')}
            testId={TEST_IDS.admin.publishToggle}
          />
          <Button
            type="submit"
            iconLeft={Save}
            loading={methods.formState.isSubmitting}
            disabled={methods.formState.isSubmitting}
            data-testid={TEST_IDS.admin.saveTool}
          >
            {t('tool.save')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
