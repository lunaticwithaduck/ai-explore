import { cva } from 'class-variance-authority';

export const imageStyles = cva('block max-w-full', {
  variants: {
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
      none: '',
    },
    radius: {
      none: '',
      md: 'rounded-md',
      lg: 'rounded-lg',
      card: 'rounded-card',
      full: 'rounded-full',
    },
  },
  defaultVariants: { fit: 'none', radius: 'none' },
});
