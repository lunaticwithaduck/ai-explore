import { cva, type VariantProps } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const cardStyles = cva('relative rounded-card border text-text', {
  variants: {
    variant: {
      raised: 'border-border bg-surface-raised',
      flat: 'border-border bg-surface',
      interactive: [
        'cursor-pointer border-border bg-surface-raised transition-all duration-base',
        'hover:scale-102 hover:border-accent/50',
        'has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-focus-ring',
        focusRing,
      ],
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6 sm:p-8',
    },
  },
  defaultVariants: { variant: 'raised', padding: 'md' },
});

export type CardVariants = VariantProps<typeof cardStyles>;
