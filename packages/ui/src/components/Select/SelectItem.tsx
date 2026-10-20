'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { selectIndicatorStyles, selectItemStyles } from './Select.styles';

export type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item ref={ref} className={cn(selectItemStyles(), className)} {...props}>
      <SelectPrimitive.ItemIndicator className={selectIndicatorStyles()}>
        <Check aria-hidden className="size-4" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
);

SelectItem.displayName = 'SelectItem';
