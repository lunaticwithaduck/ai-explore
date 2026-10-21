'use client';

import { Heading, Tag, Text } from '@ai-explore/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { bundleToolPickerStyles } from '../BundleToolPicker/BundleToolPicker.styles';

export type ToolMultiSelectProps = {
  name: string;
  title: string;
  hint: string;
  tools: readonly { id: string; name: string }[];
};

export function ToolMultiSelect({ name, title, hint, tools }: ToolMultiSelectProps) {
  const { control } = useFormContext();
  return (
    <div className={bundleToolPickerStyles.root}>
      <Heading level={2} size="sm">
        {title}
      </Heading>
      <Controller
        control={control}
        name={name}
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
      <Text size="xs" tone="muted">
        {hint}
      </Text>
    </div>
  );
}
