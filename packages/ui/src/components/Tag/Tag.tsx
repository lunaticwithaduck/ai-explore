import { Slot, Slottable } from '@radix-ui/react-slot';
import type { LucideIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { tagStyles } from './Tag.styles';

export type TagProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> & {
  pressed?: boolean | undefined;
  onPressedChange?: ((pressed: boolean) => void) | undefined;
  icon?: LucideIcon | undefined;
  count?: number | undefined;
  size?: 'sm' | 'md' | undefined;
  asChild?: boolean;
  className?: string | undefined;
};

export const Tag = forwardRef<HTMLButtonElement, TagProps>(
  (
    {
      pressed,
      onPressedChange,
      icon: Icon,
      count,
      size,
      asChild = false,
      type,
      onClick,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        aria-pressed={pressed}
        className={cn(tagStyles({ pressed: pressed ?? false, size }), className)}
        onClick={
          onClick || onPressedChange
            ? (event) => {
                onClick?.(event);
                if (!event.defaultPrevented && pressed !== undefined) onPressedChange?.(!pressed);
              }
            : undefined
        }
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      >
        {Icon && <Icon aria-hidden className="size-3.5" />}
        <Slottable>{children}</Slottable>
        {count !== undefined && (
          <span className="rounded-full bg-surface px-1.5 text-xs text-text-muted tabular-nums">
            {count}
          </span>
        )}
      </Comp>
    );
  },
);

Tag.displayName = 'Tag';
