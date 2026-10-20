'use client';

import { useTranslations } from 'next-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { RepeaterRow } from '../RepeaterRow/RepeaterRow';
import { RepeaterSection } from '../RepeaterSection/RepeaterSection';

export function ChangeRows() {
  const t = useTranslations('admin');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'changes' });
  return (
    <RepeaterSection
      title={t('update.changes')}
      addLabel={t('update.addChange')}
      onAdd={() => append({ en: '', bg: '' })}
    >
      {fields.map((field, index) => (
        <RepeaterRow
          key={field.id}
          removeLabel={t('update.removeChange')}
          onRemove={() => remove(index)}
        >
          <AdminTextField name={`changes.${index}.en`} label={t('form.en')} />
          <AdminTextField name={`changes.${index}.bg`} label={t('form.bg')} />
        </RepeaterRow>
      ))}
    </RepeaterSection>
  );
}
