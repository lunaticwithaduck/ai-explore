import { cva } from 'class-variance-authority';

export const headingStyles = cva('font-semibold tracking-tight text-text', {
  variants: {
    level: {
      1: 'text-3xl',
      2: 'text-2xl',
      3: 'text-xl',
      4: 'text-lg',
      5: 'text-base',
      6: 'text-sm',
    },
  },
  defaultVariants: { level: 2 },
});
