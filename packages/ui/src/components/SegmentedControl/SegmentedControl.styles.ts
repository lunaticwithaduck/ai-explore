import { cva } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const segmentedControlStyles = cva(
  'inline-flex items-center gap-1 rounded-button bg-surface-overlay p-1',
  {
    variants: {
      fullWidth: {
        true: 'flex w-full',
        false: '',
      },
    },
    defaultVariants: { fullWidth: false },
  },
);

export const segmentedItemStyles = cva(
  [
    'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-text-muted transition-colors duration-fast hover:text-text',
    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm',
    focusRing,
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-3 text-sm',
      },
      fullWidth: {
        true: 'flex-1',
        false: '',
      },
      stacked: {
        true: 'h-auto flex-col gap-0.5 py-2 leading-tight',
        false: '',
      },
    },
    defaultVariants: { size: 'md', fullWidth: false, stacked: false },
  },
);

export const segmentedDescriptionStyles = cva('font-normal text-xs');
