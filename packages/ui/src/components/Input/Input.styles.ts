import { cva, type VariantProps } from 'class-variance-authority';

export const fieldStyles = cva(
  [
    'w-full min-w-0 rounded-button border bg-field text-field-text caret-field-text placeholder:text-field-placeholder',
    'outline-hidden transition-shadow duration-fast focus-visible:ring-3 focus-visible:ring-focus-ring',
    'disabled:cursor-not-allowed disabled:opacity-50 read-only:hover:border-border',
  ],
  {
    variants: {
      invalid: {
        true: 'border-danger hover:border-danger',
        false: 'border-transparent',
      },
    },
    defaultVariants: { invalid: false },
  },
);

export const inputStyles = cva('flex', {
  variants: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-base',
      lg: 'h-12 px-4 text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

export type InputSize = NonNullable<VariantProps<typeof inputStyles>['size']>;
