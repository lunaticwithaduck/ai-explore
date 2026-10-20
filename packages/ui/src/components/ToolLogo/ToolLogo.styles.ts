import { cva } from 'class-variance-authority';

export const toolLogoStyles = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-(--logo-bg) ring-1 ring-border ring-inset',
  {
    variants: {
      size: {
        sm: 'size-8 rounded-md p-1.5',
        md: 'size-12 rounded-lg p-2',
        lg: 'size-20 rounded-xl p-3.5',
      },
      shape: {
        rounded: '',
        circle: 'rounded-full',
      },
    },
    defaultVariants: { size: 'md', shape: 'rounded' },
  },
);
