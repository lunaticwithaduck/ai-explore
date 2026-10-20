import { Star } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { starIconStyles, starRatingStyles, starValueStyles } from './StarRating.styles';

export type StarRatingProps = Omit<HTMLAttributes<HTMLSpanElement>, 'aria-label' | 'role'> & {
  value: number;
  label: string;
  valueText?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  className?: string | undefined;
};

const STARS = [1, 2, 3, 4, 5] as const;

export const StarRating = forwardRef<HTMLSpanElement, StarRatingProps>(
  ({ value, label, valueText, size, className, ...props }, ref) => {
    const rounded = Math.round(Math.min(5, Math.max(0, value)) * 2) / 2;
    return (
      <span
        ref={ref}
        role="img"
        aria-label={label}
        className={cn(starRatingStyles({ size }), className)}
        {...props}
      >
        {STARS.map((star) => {
          const fill = Math.min(1, Math.max(0, rounded - (star - 1)));
          return (
            <span key={star} aria-hidden className="relative inline-flex">
              <Star className={starIconStyles({ size, filled: fill === 1 })} />
              {fill === 0.5 && (
                <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                  <Star className={starIconStyles({ size, filled: true })} />
                </span>
              )}
            </span>
          );
        })}
        {valueText && (
          <span aria-hidden className={starValueStyles({ size })}>
            {valueText}
          </span>
        )}
      </span>
    );
  },
);

StarRating.displayName = 'StarRating';
