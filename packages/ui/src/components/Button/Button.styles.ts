import { cva, type VariantProps } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const buttonStyles = cva(
  [
    'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-button border font-medium transition-colors duration-fast',
    focusRing,
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-accent text-accent-foreground hover:bg-accent-hover',
        secondary:
          'border-border bg-surface-overlay text-text hover:border-border-strong hover:bg-border',
        ghost:
          'border-transparent bg-transparent text-text-muted hover:bg-surface-raised hover:text-text',
        danger:
          'border-transparent bg-danger-subtle text-danger hover:bg-danger hover:text-text-inverse',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export const buttonIconStyles = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-4',
      lg: 'size-5',
    },
  },
  defaultVariants: { size: 'md' },
});

export type ButtonVariants = VariantProps<typeof buttonStyles>;
