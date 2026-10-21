'use client';

import { DIFFICULTIES } from '@ai-explore/schemas';
import { useTranslations } from 'next-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { EMPTY_TUTORIAL } from '../../config/toolForm';
import { AdminSelectField } from '../AdminSelectField/AdminSelectField';
import { AdminTextField } from '../AdminTextField/AdminTextField';
import { RepeaterRow } from '../RepeaterRow/RepeaterRow';
import { RepeaterSection } from '../RepeaterSection/RepeaterSection';

export function ToolTutorialRows() {
  const t = useTranslations('admin');
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'tutorials' });
  const levels = DIFFICULTIES.map((value) => ({ value, label: t(`tool.difficulties.${value}`) }));
  return (
    <RepeaterSection
      title={t('tool.tutorials')}
      addLabel={t('tool.addTutorial')}
      onAdd={() => append({ ...EMPTY_TUTORIAL, title: { en: '', bg: '' } })}
    >
      {fields.map((field, index) => (
        <RepeaterRow
          key={field.id}
          removeLabel={t('tool.removeTutorial')}
          onRemove={() => remove(index)}
        >
          <AdminTextField
            name={`tutorials.${index}.youtubeId`}
            label={t('tool.youtubeId')}
            hint={t('tool.hints.youtubeId')}
            placeholder={t('tool.placeholders.youtubeId')}
          />
          <AdminTextField
            numeric
            name={`tutorials.${index}.durationMin`}
            label={t('tool.minutes')}
          />
          <AdminTextField name={`tutorials.${index}.title.en`} label={t('tool.titleEn')} />
          <AdminTextField name={`tutorials.${index}.title.bg`} label={t('tool.titleBg')} />
          <AdminSelectField
            name={`tutorials.${index}.difficulty`}
            label={t('tool.difficulty')}
            options={levels}
          />
        </RepeaterRow>
      ))}
    </RepeaterSection>
  );
}
