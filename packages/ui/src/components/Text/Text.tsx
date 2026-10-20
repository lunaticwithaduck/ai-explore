import type { VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { textStyles } from './Text.styles';

export type TextProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textStyles> & {
    as?: 'p' | 'span' | 'div' | undefined;
    className?: string | undefined;
  };

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Tag = 'p', tone, size, weight, clamp, numeric, className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(textStyles({ tone, size, weight, clamp, numeric }), className)}
      {...props}
    />
  ),
);

Text.displayName = 'Text';
