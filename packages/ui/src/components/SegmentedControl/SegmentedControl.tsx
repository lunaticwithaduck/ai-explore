'use client';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { LucideIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import {
  segmentedControlStyles,
  segmentedDescriptionStyles,
  segmentedItemStyles,
} from './SegmentedControl.styles';

export type SegmentedOption = {
  value: string;
  label: string;
  description?: string | undefined;
  icon?: LucideIcon | undefined;
  disabled?: boolean | undefined;
  testId?: string | undefined;
};

export type SegmentedControlProps = Omit<
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
  'type' | 'value' | 'defaultValue' | 'onValueChange' | 'aria-label' | 'children'
> & {
  options: readonly SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  size?: 'sm' | 'md' | undefined;
  fullWidth?: boolean | undefined;
};

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ options, value, onValueChange, label, size, fullWidth = false, className, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next);
      }}
      aria-label={label}
      className={cn(segmentedControlStyles({ fullWidth }), className)}
      {...props}
    >
      {options.map(
        ({ value: optionValue, label: optionLabel, description, icon: Icon, disabled, testId }) => (
          <ToggleGroupPrimitive.Item
            key={optionValue}
            value={optionValue}
            disabled={disabled}
            data-id={optionValue}
            data-testid={testId}
            className={segmentedItemStyles({ size, fullWidth, stacked: description !== undefined })}
          >
            {Icon && <Icon aria-hidden className="size-4" />}
            {optionLabel}
            {description !== undefined && (
              <span className={segmentedDescriptionStyles()}>{description}</span>
            )}
          </ToggleGroupPrimitive.Item>
        ),
      )}
    </ToggleGroupPrimitive.Root>
  ),
);

SegmentedControl.displayName = 'SegmentedControl';
