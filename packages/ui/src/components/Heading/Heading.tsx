import type { VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { HEADING_LEVEL_SIZE, headingStyles } from './Heading.styles';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  size?: VariantProps<typeof headingStyles>['size'];
  className?: string | undefined;
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, size, className, ...props }, ref) => {
    const Tag = `h${level}` as const;
    return (
      <Tag
        ref={ref}
        className={cn(headingStyles({ size: size ?? HEADING_LEVEL_SIZE[level] }), className)}
        {...props}
      />
    );
  },
);

Heading.displayName = 'Heading';
