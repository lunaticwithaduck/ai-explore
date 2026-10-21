import { cva } from 'class-variance-authority';

export const headingStyles = cva('text-balance font-medium text-text', {
  variants: {
    size: {
      xs: 'text-sm',
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
  },
  defaultVariants: { size: 'xl' },
});

export const HEADING_LEVEL_SIZE = {
  1: '2xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'xs',
  6: 'xs',
} as const;
