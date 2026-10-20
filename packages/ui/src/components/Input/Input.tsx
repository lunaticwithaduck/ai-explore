import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { fieldStyles, type InputSize, inputStyles } from './Input.styles';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize | undefined;
  invalid?: boolean | undefined;
  className?: string | undefined;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, invalid = false, type = 'text', className, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(fieldStyles({ invalid }), inputStyles({ size }), className)}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
