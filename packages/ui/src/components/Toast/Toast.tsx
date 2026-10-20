'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { toastIconStyles, toastStyles } from './Toast.styles';

export type ToastTone = 'neutral' | 'success' | 'danger';

export type ToastAction = {
  label: string;
  altText: string;
  onClick: () => void;
};

export type ToastProps = Omit<
  ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
  'title' | 'children'
> & {
  title: string;
  description?: string | undefined;
  tone?: ToastTone | undefined;
  action?: ToastAction | undefined;
  closeLabel: string;
};

const TONE_ICONS = { neutral: Info, success: CircleCheck, danger: CircleAlert } as const;

export const Toast = forwardRef<HTMLLIElement, ToastProps>(
  ({ title, description, tone = 'neutral', action, closeLabel, className, ...props }, ref) => {
    const Icon = TONE_ICONS[tone];
    return (
      <ToastPrimitive.Root ref={ref} className={cn(toastStyles(), className)} {...props}>
        <Icon aria-hidden className={toastIconStyles({ tone })} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastPrimitive.Title className="font-semibold text-sm text-text">
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description className="text-sm text-text-muted">
              {description}
            </ToastPrimitive.Description>
          )}
          {action && (
            <ToastPrimitive.Action altText={action.altText} asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={action.onClick}
                className="mt-2 self-start"
              >
                {action.label}
              </Button>
            </ToastPrimitive.Action>
          )}
        </div>
        <ToastPrimitive.Close asChild>
          <IconButton icon={X} label={closeLabel} size="sm" className="absolute top-2 right-2" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    );
  },
);

Toast.displayName = 'Toast';
