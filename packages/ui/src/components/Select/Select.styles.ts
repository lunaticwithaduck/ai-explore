import { cva } from 'class-variance-authority';

export const selectTriggerStyles = cva(
  'items-center justify-between gap-2 text-left data-placeholder:text-field-placeholder [&>span]:truncate',
);

export const selectContentStyles = cva(
  'z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border bg-surface-raised text-text shadow-overlay data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in',
);

export const selectItemStyles = cva(
  'relative flex h-9 cursor-default select-none items-center rounded-md pr-3 pl-8 text-sm text-text outline-hidden data-disabled:pointer-events-none data-highlighted:bg-surface-overlay data-disabled:opacity-50',
);

export const selectIndicatorStyles = cva(
  'absolute left-2 inline-flex size-4 items-center justify-center text-accent',
);
