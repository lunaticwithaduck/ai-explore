'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { tooltipContentStyles } from './Tooltip.styles';

type RootProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

export type TooltipProps = Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  'content' | 'children'
> & {
  content: ReactNode;
  children: ReactElement;
  open?: RootProps['open'];
  defaultOpen?: RootProps['defaultOpen'];
  onOpenChange?: RootProps['onOpenChange'];
  delayDuration?: number | undefined;
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      open,
      defaultOpen,
      onOpenChange,
      delayDuration = 300,
      sideOffset = 6,
      className,
      ...props
    },
    ref,
  ) => (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(tooltipContentStyles(), className)}
            {...props}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  ),
);

Tooltip.displayName = 'Tooltip';
