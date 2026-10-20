import { Slot, Slottable } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { type ButtonVariants, buttonStyles } from '../Button/Button.styles';
import { iconButtonIconStyles, iconButtonStyles } from './IconButton.styles';

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> &
  VariantProps<typeof iconButtonStyles> & {
    icon: LucideIcon;
    label: string;
    variant?: ButtonVariants['variant'];
    asChild?: boolean;
    className?: string | undefined;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      label,
      variant = 'ghost',
      size,
      shape,
      asChild = false,
      type,
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
        aria-label={label}
        className={cn(
          buttonStyles({ variant, size }),
          iconButtonStyles({ size, shape }),
          className,
        )}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      >
        <Icon aria-hidden className={iconButtonIconStyles({ size })} />
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);

IconButton.displayName = 'IconButton';
