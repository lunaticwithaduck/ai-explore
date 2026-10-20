import { cva } from 'class-variance-authority';

export const sheetContentStyles = cva(
  'fixed inset-y-0 z-50 flex h-full w-full max-w-xs flex-col border-border bg-surface-raised text-text shadow-overlay outline-hidden',
  {
    variants: {
      side: {
        left: 'left-0 border-r data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left',
        right:
          'right-0 border-l data-[state=closed]:animate-slide-out-right data-[state=open]:animate-slide-in-right',
      },
    },
    defaultVariants: { side: 'left' },
  },
);

export const sheetHeaderStyles = cva(
  'flex min-h-14 items-center justify-between gap-3 border-border border-b px-4',
);
