'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton/IconButton';
import {
  dialogCloseStyles,
  dialogContentStyles,
  dialogDescriptionStyles,
  dialogFooterStyles,
  dialogOverlayStyles,
  dialogTitleStyles,
  overlayStyles,
} from './Dialog.styles';

type RootProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

export type DialogProps = Omit<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  'title' | 'children'
> & {
  open?: RootProps['open'];
  defaultOpen?: RootProps['defaultOpen'];
  onOpenChange?: RootProps['onOpenChange'];
  trigger?: ReactNode;
  title: string;
  description?: string | undefined;
  closeLabel: string;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | undefined;
  children?: ReactNode;
};

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      defaultOpen,
      onOpenChange,
      trigger,
      title,
      description,
      closeLabel,
      footer,
      size,
      className,
      children,
      ...contentProps
    },
    ref,
  ) => (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={cn(overlayStyles(), dialogOverlayStyles())}>
          <DialogPrimitive.Content
            ref={ref}
            className={cn(dialogContentStyles({ size }), className)}
            {...(description ? {} : { 'aria-describedby': undefined })}
            {...contentProps}
          >
            <DialogPrimitive.Title className={dialogTitleStyles()}>{title}</DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className={dialogDescriptionStyles()}>
                {description}
              </DialogPrimitive.Description>
            )}
            <DialogPrimitive.Close asChild>
              <IconButton icon={X} label={closeLabel} size="sm" className={dialogCloseStyles()} />
            </DialogPrimitive.Close>
            {children && <div className="mt-5">{children}</div>}
            {footer && <div className={dialogFooterStyles()}>{footer}</div>}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  ),
);

Dialog.displayName = 'Dialog';
