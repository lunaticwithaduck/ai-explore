import { cva } from 'class-variance-authority';
import { floatingPanel } from '../../lib/floatingPanel';

export const popoverContentStyles = cva(
  [floatingPanel, 'max-w-(--radix-popover-content-available-width) p-4'],
  {
    variants: {
      size: {
        sm: 'w-56',
        md: 'w-72',
        lg: 'w-96',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
