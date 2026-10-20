import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { type CardVariants, cardStyles } from './Card.styles';

export type CardProps = HTMLAttributes<HTMLDivElement> &
  CardVariants & {
    asChild?: boolean;
    className?: string | undefined;
  };

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, padding, asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp ref={ref} className={cn(cardStyles({ variant, padding }), className)} {...props} />
    );
  },
);

Card.displayName = 'Card';
