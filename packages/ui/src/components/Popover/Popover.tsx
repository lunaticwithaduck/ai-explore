'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { popoverContentStyles } from './Popover.styles';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  size?: 'sm' | 'md' | 'lg' | undefined;
};

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, size, sideOffset = 6, align = 'center', ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={cn(popoverContentStyles({ size }), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);

PopoverContent.displayName = 'PopoverContent';
