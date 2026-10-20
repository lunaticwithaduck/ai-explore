'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, type LucideIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { dropdownMenuIconStyles, dropdownMenuItemStyles } from './DropdownMenu.styles';

export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
> & {
  icon?: LucideIcon | undefined;
  iconClassName?: string | undefined;
};

export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ icon: Icon, iconClassName, className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(dropdownMenuItemStyles({ indicator: true }), className)}
      {...props}
    >
      {Icon && <Icon aria-hidden className={cn(dropdownMenuIconStyles(), iconClassName)} />}
      {children}
      <DropdownMenuPrimitive.ItemIndicator className="absolute right-2.5 inline-flex text-accent">
        <Check aria-hidden className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  ),
);

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';
