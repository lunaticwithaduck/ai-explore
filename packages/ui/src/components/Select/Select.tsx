'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { fieldStyles, type InputSize, inputStyles } from '../Input/Input.styles';
import { selectContentStyles, selectTriggerStyles } from './Select.styles';
import { SelectItem } from './SelectItem';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean | undefined;
  testId?: string | undefined;
};

type RootProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

export type SelectProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
  'children' | 'value' | 'defaultValue' | 'dir'
> & {
  options: readonly SelectOption[];
  value?: RootProps['value'];
  defaultValue?: RootProps['defaultValue'];
  onValueChange?: RootProps['onValueChange'];
  open?: RootProps['open'];
  onOpenChange?: RootProps['onOpenChange'];
  name?: string | undefined;
  required?: boolean | undefined;
  placeholder?: string | undefined;
  size?: InputSize | undefined;
  invalid?: boolean | undefined;
  contentClassName?: string | undefined;
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      open,
      onOpenChange,
      name,
      required,
      disabled,
      placeholder,
      size,
      invalid = false,
      className,
      contentClassName,
      ...triggerProps
    },
    ref,
  ) => (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      onOpenChange={onOpenChange}
      name={name}
      required={required}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldStyles({ invalid }),
          inputStyles({ size }),
          selectTriggerStyles(),
          className,
        )}
        {...triggerProps}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-text-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={cn(selectContentStyles(), contentClassName)}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                data-id={option.value}
                data-testid={option.testId}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  ),
);

Select.displayName = 'Select';
