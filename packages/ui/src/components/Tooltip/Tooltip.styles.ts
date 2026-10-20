import { cva } from 'class-variance-authority';

export const tooltipContentStyles = cva(
  'z-50 max-w-xs rounded-md border border-border-strong bg-surface-overlay px-2.5 py-1.5 text-text text-xs leading-snug shadow-md data-[state=closed]:animate-fade-out data-[state=delayed-open]:animate-fade-in data-[state=instant-open]:animate-fade-in',
);
