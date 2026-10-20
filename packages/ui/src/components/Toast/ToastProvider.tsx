'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ToastViewport } from './ToastViewport';

export type ToastProviderProps = Omit<
  ComponentPropsWithoutRef<typeof ToastPrimitive.Provider>,
  'label'
> & {
  label: string;
  viewportLabel: string;
  viewportClassName?: string | undefined;
  children?: ReactNode;
};

export function ToastProvider({
  label,
  viewportLabel,
  viewportClassName,
  children,
  ...props
}: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider label={label} {...props}>
      {children}
      <ToastViewport label={viewportLabel} className={viewportClassName} />
    </ToastPrimitive.Provider>
  );
}
