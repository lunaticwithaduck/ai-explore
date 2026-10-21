'use client';

import type { SelectOption } from '@ai-explore/ui';
import { Card, Heading } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { adminToolField } from '@/config/test-ids';
import { AdminSelectField } from '../AdminSelectField/AdminSelectField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { toolFormStyles } from '../ToolForm/ToolForm.styles';

export type ToolBasicsCardProps = {
  mode: 'create' | 'edit';
  categories: readonly SelectOption[];
};

export function ToolBasicsCard({ mode, categories }: ToolBasicsCardProps) {
  const t = useTranslations('admin');
  return (
    <Card padding="md" className={toolFormStyles.card}>
      <Heading level={2} size="sm">
        {t('tool.basics')}
      </Heading>
      <div className={toolFormStyles.grid}>
        {mode === 'create' && (
          <AdminTextField
            wide
            name="slug"
            label={t('tool.slug')}
            hint={t('tool.hints.slug')}
            placeholder={t('tool.placeholders.slug')}
            testId={adminToolField('slug')}
          />
        )}
        <AdminTextField name="name" label={t('tool.name')} testId={adminToolField('name')} />
        <AdminTextField
          name="developer"
          label={t('tool.developer')}
          testId={adminToolField('developer')}
        />
        <AdminTextField
          name="websiteUrl"
          label={t('tool.websiteUrl')}
          hint={t('tool.hints.websiteUrl')}
          placeholder={t('tool.placeholders.websiteUrl')}
          inputType="url"
          testId={adminToolField('websiteUrl')}
        />
        <AdminSelectField
          name="categoryId"
          label={t('tool.category')}
          options={categories}
          placeholder={t('tool.categoryPlaceholder')}
          testId={adminToolField('categoryId')}
        />
        <AdminTextField
          name="tagline.en"
          label={t('tool.taglineEn')}
          testId={adminToolField('tagline.en')}
        />
        <AdminTextField
          name="tagline.bg"
          label={t('tool.taglineBg')}
          hint={t('tool.hints.bgOptional')}
          testId={adminToolField('tagline.bg')}
        />
        <AdminTextField
          multiline
          name="description.en"
          label={t('tool.descriptionEn')}
          testId={adminToolField('description.en')}
        />
        <AdminTextField
          multiline
          name="description.bg"
          label={t('tool.descriptionBg')}
          hint={t('tool.hints.bgOptional')}
          testId={adminToolField('description.bg')}
        />
        <AdminTextField
          name="logo.path"
          label={t('tool.logoPath')}
          hint={t('tool.hints.logoPath')}
          placeholder={t('tool.placeholders.logoPath')}
          testId={adminToolField('logo.path')}
        />
        <AdminTextField
          name="logo.background"
          label={t('tool.logoBackground')}
          hint={t('tool.hints.logoBackground')}
          placeholder={t('tool.placeholders.logoBackground')}
          testId={adminToolField('logo.background')}
        />
      </div>
    </Card>
  );
}
