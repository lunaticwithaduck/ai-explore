'use client';

import { Tag } from '@ai-explore/ui';
import { Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FILTER_TAGS } from '../../config/constants';

export function TagsDemo() {
  const t = useTranslations('dev');
  const [selected, setSelected] = useState<string[]>(['image']);
  const toggle = (tag: string, pressed: boolean) =>
    setSelected((current) => (pressed ? [...current, tag] : current.filter((x) => x !== tag)));

  return (
    <>
      {FILTER_TAGS.map((tag, index) => (
        <Tag
          key={tag}
          data-id={tag}
          icon={Hash}
          count={(index + 2) * 3}
          pressed={selected.includes(tag)}
          onPressedChange={(pressed) => toggle(tag, pressed)}
        >
          {t(`surfaces.tag.${tag}`)}
        </Tag>
      ))}
      <Tag size="sm">{t('surfaces.tagPlain')}</Tag>
    </>
  );
}
