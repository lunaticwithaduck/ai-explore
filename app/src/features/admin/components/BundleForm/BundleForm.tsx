'use client';

import { ACCENTS, BUNDLE_PERIODS } from '@ai-explore/schemas';
import { Button, Card } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { type BundleFormValues, bundleFormSchema } from '../../config/bundleForm';
import { AdminMoneyField } from '../AdminMoneyField/AdminMoneyField';
import { AdminSelectField } from '../AdminSelectField/AdminSelectField';
import { AdminSwitchField } from '../AdminSwitchField/AdminSwitchField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { BundleToolPicker } from '../BundleToolPicker/BundleToolPicker';
import { QueryNotice } from '../QueryNotice/QueryNotice';
import { SavedNotice } from '../SavedNotice/SavedNotice';
import { bundleFormStyles } from './BundleForm.styles';

export type BundleFormProps = {
  mode: 'create' | 'edit';
  initial: BundleFormValues;
  tools: readonly { id: string; name: string }[];
  takenSlugs: readonly string[];
  error: unknown;
  saved: boolean;
  onSubmit: (values: BundleFormValues) => Promise<void>;
};

export function BundleForm({
  mode,
  initial,
  tools,
  takenSlugs,
  error,
  saved,
  onSubmit,
}: BundleFormProps) {
  const t = useTranslations('admin');
  const methods = useForm<BundleFormValues>({
    resolver: zodResolver(bundleFormSchema),
    defaultValues: initial,
  });
  const submit = methods.handleSubmit(async (values) => {
    if (mode === 'create' && takenSlugs.includes(values.slug)) {
      methods.setError('slug', { type: 'taken' });
      return;
    }
    await onSubmit(values);
  });
  const accents = ACCENTS.map((value) => ({ value, label: t(`bundle.accents.${value}`) }));
  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={submit} className={bundleFormStyles.form}>
        <Card padding="md" className={bundleFormStyles.card}>
          <div className={bundleFormStyles.grid}>
            {mode === 'create' && (
              <AdminTextField
                wide
                name="slug"
                label={t('bundle.slug')}
                hint={t('tool.hints.slug')}
                placeholder={t('bundle.placeholders.slug')}
              />
            )}
            <AdminTextField name="name.en" label={t('bundle.nameEn')} />
            <AdminTextField name="name.bg" label={t('bundle.nameBg')} />
            <AdminTextField multiline name="description.en" label={t('bundle.descriptionEn')} />
            <AdminTextField multiline name="description.bg" label={t('bundle.descriptionBg')} />
            <AdminTextField
              name="icon"
              label={t('bundle.icon')}
              hint={t('bundle.hints.icon')}
              placeholder={t('bundle.placeholders.icon')}
            />
            <AdminSelectField name="accent" label={t('bundle.accent')} options={accents} />
          </div>
          <div className={bundleFormStyles.grid}>
            {BUNDLE_PERIODS.map((period) => (
              <AdminMoneyField
                key={period}
                name={`pricing.${period}.priceCents`}
                label={t('bundle.price', { period: t(`bundle.periods.${period}`) })}
                hint={t('bundle.hints.price')}
                placeholder={t('bundle.placeholders.price')}
              />
            ))}
          </div>
          <BundleToolPicker tools={tools} />
        </Card>
        <QueryNotice error={error} />
        <SavedNotice saved={saved} />
        <div className={bundleFormStyles.footer}>
          <AdminSwitchField name="published" label={t('bundle.published')} />
          <Button
            type="submit"
            iconLeft={Save}
            loading={methods.formState.isSubmitting}
            disabled={methods.formState.isSubmitting}
          >
            {t('bundle.save')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
