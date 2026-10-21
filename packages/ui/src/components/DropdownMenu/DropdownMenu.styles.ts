import { cva } from 'class-variance-authority';
import { floatingPanel } from '../../lib/floatingPanel';

export const dropdownMenuContentStyles = cva([
  floatingPanel,
  'max-h-(--radix-dropdown-menu-content-available-height) min-w-48 overflow-y-auto p-1',
]);

export const dropdownMenuItemStyles = cva(
  'relative flex min-h-9 cursor-default select-none items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm outline-hidden transition-colors duration-fast data-disabled:pointer-events-none data-disabled:opacity-50',
  {
    variants: {
      tone: {
        default: 'text-text data-highlighted:bg-surface-overlay',
        danger: 'text-danger data-highlighted:bg-danger-subtle',
      },
      indicator: {
        true: 'pr-8',
        false: '',
      },
    },
    defaultVariants: { tone: 'default', indicator: false },
  },
);

export const dropdownMenuIconStyles = cva('size-4 shrink-0 text-text-muted');

export const dropdownMenuLabelStyles = cva(
  'px-2.5 pt-2 pb-1 font-medium text-text-muted text-xs uppercase tracking-wide',
);

export const dropdownMenuSeparatorStyles = cva('-mx-1 my-1 h-px bg-border');
