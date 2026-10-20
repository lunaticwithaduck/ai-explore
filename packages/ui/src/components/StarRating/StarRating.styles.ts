import { cva } from 'class-variance-authority';

export const starRatingStyles = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-0.5',
      md: 'gap-0.5',
      lg: 'gap-1',
    },
  },
  defaultVariants: { size: 'md' },
});

export const starIconStyles = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-5',
    },
    filled: {
      true: 'fill-star text-star',
      false: 'fill-surface-overlay text-border-strong',
    },
  },
  defaultVariants: { size: 'md', filled: false },
});

export const starValueStyles = cva('ml-1.5 font-medium text-text tabular-nums', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
});
