import { cva } from 'class-variance-authority';
import { focusRing } from '../../lib/focusRing';

export const textLinkStyles = cva(
  [
    'inline-flex items-center gap-1 rounded-xs font-medium underline-offset-4 transition-colors duration-fast',
    focusRing,
  ],
  {
    variants: {
      tone: {
        accent: 'text-accent hover:text-accent-hover',
        default: 'text-text hover:text-accent',
        muted: 'text-text-muted hover:text-text',
        inherit: 'text-inherit',
      },
      underline: {
        hover: 'hover:underline',
        always: 'underline',
        none: '',
      },
      size: {
        inherit: '',
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
      },
    },
    defaultVariants: { tone: 'accent', underline: 'hover', size: 'inherit' },
  },
);
