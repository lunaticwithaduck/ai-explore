import { cva, type VariantProps } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const tagStyles = cva(
  [
    'inline-flex shrink-0 select-none items-center gap-1.5 whitespace-nowrap rounded-full border font-medium transition-colors duration-fast',
    focusRing,
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      pressed: {
        true: 'border-transparent bg-accent text-accent-foreground',
        false: 'border-transparent bg-surface-overlay text-text hover:bg-surface-overlay/80',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-3 text-sm',
      },
    },
    defaultVariants: { pressed: false, size: 'md' },
  },
);

export type TagVariants = VariantProps<typeof tagStyles>;
