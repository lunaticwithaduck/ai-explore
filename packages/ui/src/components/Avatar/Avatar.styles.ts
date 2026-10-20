import { cva } from 'class-variance-authority';

export const avatarStyles = cva(
  'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border bg-surface-overlay',
  {
    variants: {
      size: {
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-14 text-lg',
        xl: 'size-20 text-2xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
