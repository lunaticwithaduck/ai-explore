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
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'sm',
  6: 'xs',
} as const;
