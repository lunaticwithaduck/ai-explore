import { cva, type VariantProps } from 'class-variance-authority';

export const fieldStyles = cva(
  [
    'w-full min-w-0 rounded-button border bg-surface-sunken text-text caret-accent placeholder:text-text-subtle',
    'outline-hidden transition-shadow duration-fast hover:border-border-strong focus-visible:ring-3 focus-visible:ring-focus-ring',
    'disabled:cursor-not-allowed disabled:opacity-50 read-only:hover:border-border',
  ],
  {
    variants: {
      invalid: {
        true: 'border-danger hover:border-danger',
        false: 'border-border',
      },
    },
    defaultVariants: { invalid: false },
  },
);

export const inputStyles = cva('flex', {
  variants: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-base sm:text-sm',
      lg: 'h-12 px-4 text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

export type InputSize = NonNullable<VariantProps<typeof inputStyles>['size']>;
