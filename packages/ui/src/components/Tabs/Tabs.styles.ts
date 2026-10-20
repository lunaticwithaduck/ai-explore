import { cva } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const tabsListStyles = cva('flex items-center', {
  variants: {
    variant: {
      underline: 'gap-1 overflow-x-auto border-border border-b',
      pill: 'inline-flex gap-1 rounded-button border border-border bg-surface-sunken p-1',
    },
  },
  defaultVariants: { variant: 'underline' },
});

export const tabsTriggerStyles = cva(
  [
    'relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-medium text-sm text-text-muted transition-colors duration-fast hover:text-text data-[state=active]:text-text',
    focusRing,
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        underline:
          'h-10 rounded-t-md px-3 after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full data-[state=active]:after:bg-accent',
        pill: 'h-8 rounded-md px-3 data-[state=active]:bg-surface-overlay data-[state=active]:shadow-sm',
      },
    },
    defaultVariants: { variant: 'underline' },
  },
);

export const tabsContentStyles = cva(['mt-4', focusRing]);
