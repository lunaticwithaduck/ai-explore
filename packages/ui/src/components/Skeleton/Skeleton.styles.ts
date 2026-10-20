import { cva } from 'class-variance-authority';

export const skeletonStyles = cva('animate-pulse bg-border', {
  variants: {
    shape: {
      rect: 'rounded-md',
      circle: 'rounded-full',
      text: 'h-4 w-full rounded-xs',
      card: 'rounded-card',
    },
  },
  defaultVariants: { shape: 'rect' },
});
