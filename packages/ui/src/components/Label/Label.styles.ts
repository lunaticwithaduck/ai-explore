import { cva } from 'class-variance-authority';

export const labelStyles = cva(
  'select-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
      },
      tone: {
        default: 'text-text',
        muted: 'text-text-muted',
      },
    },
    defaultVariants: { size: 'md', tone: 'default' },
  },
);
