'use client';

import { useTranslations } from 'next-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { EMPTY_LOCALIZED } from '../../config/toolForm';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { RepeaterRow } from '../RepeaterRow/RepeaterRow';
import { RepeaterSection } from '../RepeaterSection/RepeaterSection';

export function ToolListRows() {
  const t = useTranslations('admin');
  const { control } = useFormContext();
  const tags = useFieldArray({ control, name: 'tags' });
  const features = useFieldArray({ control, name: 'features' });
  return (
    <>
      <RepeaterSection
        title={t('tool.tags')}
        addLabel={t('tool.addTag')}
        onAdd={() => tags.append({ value: '' })}
      >
        {tags.fields.map((field, index) => (
          <RepeaterRow
            key={field.id}
            removeLabel={t('tool.removeTag')}
            onRemove={() => tags.remove(index)}
          >
            <AdminTextField name={`tags.${index}.value`} label={t('tool.tag')} />
          </RepeaterRow>
        ))}
      </RepeaterSection>
      <RepeaterSection
        title={t('tool.features')}
        addLabel={t('tool.addFeature')}
        onAdd={() => features.append({ ...EMPTY_LOCALIZED })}
      >
        {features.fields.map((field, index) => (
          <RepeaterRow
            key={field.id}
            removeLabel={t('tool.removeFeature')}
            onRemove={() => features.remove(index)}
          >
            <AdminTextField name={`features.${index}.en`} label={t('form.en')} />
            <AdminTextField name={`features.${index}.bg`} label={t('form.bg')} />
          </RepeaterRow>
        ))}
      </RepeaterSection>
    </>
  );
}
