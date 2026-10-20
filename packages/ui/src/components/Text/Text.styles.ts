import { cva } from 'class-variance-authority';

export const textStyles = cva('', {
  variants: {
    tone: {
      default: 'text-text',
      muted: 'text-text-muted',
      subtle: 'text-text-subtle',
      accent: 'text-accent',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger',
      inherit: 'text-inherit',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    clamp: {
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
    },
    numeric: {
      true: 'tabular-nums',
    },
  },
  defaultVariants: { tone: 'default', size: 'md' },
});
