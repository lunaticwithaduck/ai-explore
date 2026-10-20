import { Slot, Slottable } from '@radix-ui/react-slot';
import { LoaderCircle, type LucideIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { type ButtonVariants, buttonIconStyles, buttonStyles } from './Button.styles';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    asChild?: boolean;
    iconLeft?: LucideIcon | undefined;
    iconRight?: LucideIcon | undefined;
    loading?: boolean;
    className?: string | undefined;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      variant,
      size,
      fullWidth,
      iconLeft,
      iconRight: IconRight,
      loading = false,
      disabled,
      type,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const IconLeft = loading ? LoaderCircle : iconLeft;
    const iconClass = buttonIconStyles({ size });
    const stateProps = asChild
      ? { 'aria-disabled': disabled || loading || undefined }
      : { type: type ?? 'button', disabled: disabled || loading };

    return (
      <Comp
        ref={ref}
        className={cn(buttonStyles({ variant, size, fullWidth }), className)}
        aria-busy={loading || undefined}
        {...stateProps}
        {...props}
      >
        {IconLeft && <IconLeft aria-hidden className={cn(iconClass, loading && 'animate-spin')} />}
        <Slottable>{children}</Slottable>
        {IconRight && <IconRight aria-hidden className={iconClass} />}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
