'use client';

import { Heading, Tag, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { Controller, get, useFormContext } from 'react-hook-form';
import { bundleToolPickerStyles } from './BundleToolPicker.styles';

export type BundleToolPickerProps = {
  tools: readonly { id: string; name: string }[];
};

export function BundleToolPicker({ tools }: BundleToolPickerProps) {
  const t = useTranslations('admin');
  const { control, formState } = useFormContext();
  const failed = Boolean(get(formState.errors, 'toolIds'));
  return (
    <div className={bundleToolPickerStyles.root}>
      <Heading level={2} size="sm">
        {t('bundle.tools')}
      </Heading>
      <Controller
        control={control}
        name="toolIds"
        render={({ field }) => {
          const selected: string[] = field.value ?? [];
          return (
            <div className={bundleToolPickerStyles.list}>
              {tools.map((tool) => (
                <Tag
                  key={tool.id}
                  data-id={tool.id}
                  pressed={selected.includes(tool.id)}
                  onPressedChange={(pressed) =>
                    field.onChange(
                      pressed ? [...selected, tool.id] : selected.filter((id) => id !== tool.id),
                    )
                  }
                >
                  {tool.name}
                </Tag>
              ))}
            </div>
          );
        }}
      />
      <Text size="xs" tone={failed ? 'danger' : 'subtle'}>
        {failed ? t('bundle.toolsInvalid') : t('bundle.toolsHint')}
      </Text>
    </div>
  );
}
