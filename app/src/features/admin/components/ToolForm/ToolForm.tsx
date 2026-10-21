'use client';

import type { SelectOption } from '@ai-explore/ui';
import { Button, Card, Heading } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { adminToolField, TEST_IDS } from '@/config/test-ids';
import { type ToolFormValues, toolFormSchema } from '../../config/toolForm';
import { AdminSwitchField } from '../AdminSwitchField/AdminSwitchField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { QueryNotice } from '../QueryNotice/QueryNotice';
import { SavedNotice } from '../SavedNotice/SavedNotice';
import { ToolBasicsCard } from '../ToolBasicsCard/ToolBasicsCard';
import { ToolComparisonCard } from '../ToolComparisonCard/ToolComparisonCard';
import { ToolListRows } from '../ToolListRows/ToolListRows';
import { ToolMultiSelect } from '../ToolMultiSelect/ToolMultiSelect';
import { ToolPlanRows } from '../ToolPlanRows/ToolPlanRows';
import { ToolTutorialRows } from '../ToolTutorialRows/ToolTutorialRows';
import { toolFormStyles } from './ToolForm.styles';

export type ToolFormProps = {
  mode: 'create' | 'edit';
  initial: ToolFormValues;
  categories: readonly SelectOption[];
  tools: readonly { id: string; name: string }[];
  takenSlugs: readonly string[];
  error: unknown;
  saved: boolean;
  onSubmit: (values: ToolFormValues) => Promise<void>;
};

export function ToolForm({
  mode,
  initial,
  categories,
  tools,
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
  const related = tools.filter((entry) => entry.id !== initial.slug);
  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit} className={toolFormStyles.form}>
        <ToolBasicsCard mode={mode} categories={categories} />
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
              hint={t('tool.hints.trialDays')}
              testId={field('pricing.trialDays')}
            />
          </div>
          <ToolPlanRows />
        </Card>
        <ToolComparisonCard />
        <Card padding="md" className={toolFormStyles.card}>
          <ToolTutorialRows />
        </Card>
        <Card padding="md" className={toolFormStyles.card}>
          <ToolMultiSelect
            name="similarToolIds"
            title={t('tool.similar')}
            hint={t('tool.hints.similar')}
            tools={related}
          />
          <ToolMultiSelect
            name="complementaryToolIds"
            title={t('tool.complementary')}
            hint={t('tool.hints.complementary')}
            tools={related}
          />
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
