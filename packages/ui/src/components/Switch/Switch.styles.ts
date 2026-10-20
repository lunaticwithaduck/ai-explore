import { cva } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const switchStyles = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-fast',
    focusRing,
    'data-[state=checked]:bg-accent data-[state=unchecked]:bg-border-strong disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const switchThumbStyles = cva(
  'pointer-events-none block rounded-full bg-text shadow-sm transition-transform duration-fast data-[state=unchecked]:translate-x-0.5',
  {
    variants: {
      size: {
        sm: 'size-4 data-[state=checked]:translate-x-4',
        md: 'size-5 data-[state=checked]:translate-x-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
