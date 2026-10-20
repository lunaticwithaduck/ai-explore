import { cva } from 'class-variance-authority';

export const iconButtonStyles = cva('px-0', {
  variants: {
    size: {
      sm: 'w-8',
      md: 'w-10',
      lg: 'w-12',
    },
    shape: {
      square: '',
      circle: 'rounded-full',
    },
  },
  defaultVariants: { size: 'md', shape: 'square' },
});

export const iconButtonIconStyles = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-5',
    },
  },
  defaultVariants: { size: 'md' },
});
