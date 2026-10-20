'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { toastViewportStyles } from './Toast.styles';

export type ToastViewportProps = Omit<
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>,
  'label'
> & {
  label: string;
};

export const ToastViewport = forwardRef<HTMLOListElement, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cn(toastViewportStyles(), className)}
      {...props}
    />
  ),
);

ToastViewport.displayName = 'ToastViewport';
