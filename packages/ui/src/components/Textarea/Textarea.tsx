import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { fieldStyles } from '../Input/Input.styles';
import { textareaStyles } from './Textarea.styles';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: 'sm' | 'md' | 'lg' | undefined;
  invalid?: boolean | undefined;
  className?: string | undefined;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size, invalid = false, rows = 4, className, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(fieldStyles({ invalid }), textareaStyles({ size }), className)}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
