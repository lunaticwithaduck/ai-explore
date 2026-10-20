import { cva } from 'class-variance-authority';

export const overlayStyles = cva(
  'fixed inset-0 z-50 bg-scrim backdrop-blur-xs data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
);

export const dialogOverlayStyles = cva('grid place-items-center overflow-y-auto p-4 sm:p-6');

export const dialogContentStyles = cva(
  'relative w-full rounded-xl border border-border bg-surface-overlay p-6 text-text shadow-overlay outline-hidden data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const dialogTitleStyles = cva('pr-10 font-semibold text-lg text-text tracking-tight');

export const dialogDescriptionStyles = cva('mt-1.5 text-sm text-text-muted leading-normal');

export const dialogCloseStyles = cva('absolute top-3 right-3');

export const dialogFooterStyles = cva(
  'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end',
);
