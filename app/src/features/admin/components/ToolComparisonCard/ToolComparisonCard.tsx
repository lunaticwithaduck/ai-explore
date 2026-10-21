'use client';

import { API_ACCESS } from '@ai-explore/schemas';
import { Card, Heading } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { AdminSelectField } from '../AdminSelectField/AdminSelectField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { toolFormStyles } from '../ToolForm/ToolForm.styles';

export function ToolComparisonCard() {
  const t = useTranslations('admin');
  const access = API_ACCESS.map((value) => ({ value, label: t(`tool.apiAccessOptions.${value}`) }));
  return (
    <Card padding="md" className={toolFormStyles.card}>
      <Heading level={2} size="sm">
        {t('tool.comparison')}
      </Heading>
      <div className={toolFormStyles.grid}>
        <AdminSelectField
          name="comparison.apiAccess"
          label={t('tool.apiAccess')}
          options={access}
        />
        <AdminTextField
          numeric
          name="comparison.integrations"
          label={t('tool.integrations')}
          hint={t('tool.hints.integrations')}
        />
        <AdminTextField
          numeric
          name="comparison.speed"
          label={t('tool.speed')}
          hint={t('tool.hints.rating')}
        />
        <AdminTextField
          numeric
          name="comparison.outputQuality"
          label={t('tool.outputQuality')}
          hint={t('tool.hints.rating')}
        />
        <AdminTextField
          name="comparison.bestUseCase.en"
          label={t('tool.bestUseCaseEn')}
          hint={t('tool.hints.bestUseCase')}
        />
        <AdminTextField
          name="comparison.bestUseCase.bg"
          label={t('tool.bestUseCaseBg')}
          hint={t('tool.hints.bgOptional')}
        />
      </div>
    </Card>
  );
}
