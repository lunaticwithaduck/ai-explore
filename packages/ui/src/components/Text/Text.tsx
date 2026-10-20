import type { VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { textStyles } from './Text.styles';

export type TextProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textStyles> & {
    className?: string | undefined;
  };

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ tone, size, className, ...props }, ref) => (
    <p ref={ref} className={cn(textStyles({ tone, size }), className)} {...props} />
  ),
);

Text.displayName = 'Text';
