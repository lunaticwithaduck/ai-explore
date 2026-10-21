import { cva } from 'class-variance-authority';

export const toastViewportStyles = cva(
  'fixed right-0 bottom-0 z-50 flex max-h-screen w-full flex-col gap-2 p-4 outline-hidden sm:max-w-sm',
);

export const toastStyles = cva([
  'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border border-border bg-surface-raised p-4 pr-11 text-text shadow-overlay',
  'data-[state=closed]:animate-fade-out data-[state=open]:animate-slide-in-right data-[swipe=end]:animate-slide-out-right',
  'data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=cancel]:transition-transform',
]);

export const toastIconStyles = cva('mt-0.5 size-5 shrink-0', {
  variants: {
    tone: {
      neutral: 'text-accent',
      success: 'text-success',
      danger: 'text-danger',
    },
  },
  defaultVariants: { tone: 'neutral' },
});
