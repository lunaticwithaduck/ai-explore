import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { headingStyles } from './Heading.styles';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  className?: string | undefined;
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, className, ...props }, ref) => {
    const Tag = `h${level}` as const;
    return <Tag ref={ref} className={cn(headingStyles({ level }), className)} {...props} />;
  },
);

Heading.displayName = 'Heading';
