'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { overlayStyles } from '../Dialog/Dialog.styles';
import { IconButton } from '../IconButton/IconButton';
import { sheetContentStyles, sheetHeaderStyles } from './Sheet.styles';

type RootProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

export type SheetProps = Omit<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  'title' | 'children'
> & {
  open?: RootProps['open'];
  defaultOpen?: RootProps['defaultOpen'];
  onOpenChange?: RootProps['onOpenChange'];
  trigger?: ReactNode;
  title: string;
  hideTitle?: boolean | undefined;
  description?: string | undefined;
  closeLabel: string;
  side?: 'left' | 'right' | undefined;
  header?: ReactNode;
  children?: ReactNode;
};

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      trigger,
      title,
      hideTitle = false,
      description,
      closeLabel,
      side,
      header,
      className,
      children,
      ...contentProps
    },
    ref,
  ) => (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayStyles()} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(sheetContentStyles({ side }), className)}
          {...(description ? {} : { 'aria-describedby': undefined })}
          {...contentProps}
        >
          <div className={sheetHeaderStyles()}>
            <DialogPrimitive.Title
              className={cn('font-semibold text-base text-text', hideTitle && 'sr-only')}
            >
              {title}
            </DialogPrimitive.Title>
            {header}
            <DialogPrimitive.Close asChild>
              <IconButton icon={X} label={closeLabel} size="sm" className="ml-auto" />
            </DialogPrimitive.Close>
          </div>
          {description && (
            <DialogPrimitive.Description className="sr-only">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  ),
);

Sheet.displayName = 'Sheet';
