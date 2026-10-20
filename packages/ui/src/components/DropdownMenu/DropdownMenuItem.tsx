'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Slottable } from '@radix-ui/react-slot';
import type { LucideIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { dropdownMenuIconStyles, dropdownMenuItemStyles } from './DropdownMenu.styles';

export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  icon?: LucideIcon | undefined;
  tone?: 'default' | 'danger' | undefined;
};

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ icon: Icon, tone, className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(dropdownMenuItemStyles({ tone }), className)}
      {...props}
    >
      {Icon && (
        <Icon
          aria-hidden
          className={cn(dropdownMenuIconStyles(), tone === 'danger' && 'text-danger')}
        />
      )}
      <Slottable>{children}</Slottable>
    </DropdownMenuPrimitive.Item>
  ),
);

DropdownMenuItem.displayName = 'DropdownMenuItem';
