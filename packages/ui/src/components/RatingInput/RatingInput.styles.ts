import { cva } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const ratingInputStyles = cva('inline-flex items-center gap-1 rounded-button', {
  variants: {
    invalid: {
      true: 'ring-1 ring-danger',
      false: '',
    },
    disabled: {
      true: 'pointer-events-none opacity-50',
      false: '',
    },
  },
  defaultVariants: { invalid: false, disabled: false },
});

export const ratingOptionStyles = cva(
  [
    'inline-flex items-center justify-center rounded-md transition-transform duration-fast hover:scale-110',
    focusRing,
  ],
  {
    variants: {
      size: {
        md: 'size-8',
        lg: 'size-10',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const ratingStarStyles = cva('transition-colors duration-fast', {
  variants: {
    size: {
      md: 'size-6',
      lg: 'size-7',
    },
    active: {
      true: 'fill-star text-star',
      false: 'fill-transparent text-border-strong',
    },
  },
  defaultVariants: { size: 'md', active: false },
});
