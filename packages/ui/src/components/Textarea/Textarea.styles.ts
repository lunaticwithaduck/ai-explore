import { cva } from 'class-variance-authority';

export const textareaStyles = cva('block min-h-24 resize-y px-3 py-2 leading-normal', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base sm:text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
});
