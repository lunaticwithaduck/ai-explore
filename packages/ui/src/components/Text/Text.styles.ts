import { cva } from 'class-variance-authority';

export const textStyles = cva('', {
  variants: {
    tone: {
      default: 'text-text',
      muted: 'text-text-muted',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
    },
  },
  defaultVariants: { tone: 'default', size: 'md' },
});
