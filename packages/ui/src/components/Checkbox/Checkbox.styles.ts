import { cva } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const checkboxStyles = cva([
  'peer inline-flex size-5 shrink-0 items-center justify-center rounded-xs border border-border-strong bg-surface-sunken text-accent-foreground transition-colors duration-fast',
  focusRing,
  'hover:border-accent data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent',
  'disabled:cursor-not-allowed disabled:opacity-50',
]);
