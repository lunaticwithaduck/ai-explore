import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { skeletonStyles } from './Skeleton.styles';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  shape?: 'rect' | 'circle' | 'text' | 'card' | undefined;
  className?: string | undefined;
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape, className, ...props }, ref) => (
    <div ref={ref} aria-hidden className={cn(skeletonStyles({ shape }), className)} {...props} />
  ),
);

Skeleton.displayName = 'Skeleton';
