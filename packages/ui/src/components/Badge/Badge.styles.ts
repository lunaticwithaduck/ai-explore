import { cva, type VariantProps } from 'class-variance-authority';

export const badgeStyles = cva(
  'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-transparent font-medium leading-none',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-surface-overlay text-text-muted',
        accent: 'bg-accent-subtle text-accent',
        solid: 'bg-accent text-accent-foreground',
        success: 'bg-success-subtle text-success',
        warning: 'bg-warning-subtle text-warning',
        danger: 'bg-danger-subtle text-danger',
        outline: 'border-border-strong bg-transparent text-text-muted',
      },
      size: {
        sm: 'h-5 px-2 text-xs',
        md: 'h-6 px-2.5 text-xs',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export type BadgeVariants = VariantProps<typeof badgeStyles>;
