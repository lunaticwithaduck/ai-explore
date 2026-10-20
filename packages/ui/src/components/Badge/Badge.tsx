import type { LucideIcon } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { type AccentName, accentSubtleClass } from '../../lib/accent';
import { cn } from '../../lib/cn';
import { type BadgeVariants, badgeStyles } from './Badge.styles';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  BadgeVariants & {
    accent?: AccentName | undefined;
    icon?: LucideIcon | undefined;
    className?: string | undefined;
  };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone, size, accent, icon: Icon, className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeStyles({ tone, size }), accent && accentSubtleClass[accent], className)}
      {...props}
    >
      {Icon && <Icon aria-hidden className="size-3" />}
      {children}
    </span>
  ),
);

Badge.displayName = 'Badge';
