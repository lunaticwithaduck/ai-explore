'use client';

import { PLAN_PERIODS } from '@ai-explore/schemas';
import { useTranslations } from 'next-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { EMPTY_PLAN } from '../../config/toolForm';
import { AdminMoneyField } from '../AdminMoneyField/AdminMoneyField';
import { AdminSelectField } from '../AdminSelectField/AdminSelectField';
import { AdminSwitchField } from '../AdminSwitchField/AdminSwitchField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { RepeaterRow } from '../RepeaterRow/RepeaterRow';
import { RepeaterSection } from '../RepeaterSection/RepeaterSection';

export function ToolPlanRows() {
  const t = useTranslations('admin');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'plans' });
  const periods = PLAN_PERIODS.map((value) => ({ value, label: t(`tool.planPeriods.${value}`) }));
  return (
    <RepeaterSection
      title={t('tool.plans')}
      addLabel={t('tool.addPlan')}
      onAdd={() => append({ ...EMPTY_PLAN })}
    >
      {fields.map((field, index) => (
        <RepeaterRow
          key={field.id}
          removeLabel={t('tool.removePlan')}
          onRemove={() => remove(index)}
        >
          <AdminTextField name={`plans.${index}.name`} label={t('tool.planName')} />
          <AdminMoneyField
            nullable
            name={`plans.${index}.priceCents`}
            label={t('tool.planPrice')}
            hint={t('tool.hints.planPrice')}
            placeholder={t('tool.placeholders.planPrice')}
          />
          <AdminSelectField
            name={`plans.${index}.period`}
            label={t('tool.planPeriod')}
            options={periods}
          />
          <AdminSwitchField name={`plans.${index}.popular`} label={t('tool.planPopular')} />
        </RepeaterRow>
      ))}
    </RepeaterSection>
  );
}
