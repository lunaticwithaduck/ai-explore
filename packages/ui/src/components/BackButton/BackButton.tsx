import { Slot, Slottable } from '@radix-ui/react-slot';
import { ArrowLeft } from 'lucide-react';
import { type ButtonHTMLAttributes, forwardRef, type ReactElement } from 'react';
import { cn } from '../../lib/cn';
import { buttonIconStyles, buttonStyles } from '../Button/Button.styles';
import { backButtonStyles } from './BackButton.styles';

export type BackButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string;
  asChild?: boolean;
  size?: 'sm' | 'md' | undefined;
  children?: ReactElement | undefined;
  className?: string | undefined;
};

export const BackButton = forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ label, asChild = false, size = 'sm', type, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonStyles({ variant: 'ghost', size }), backButtonStyles(), className)}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      >
        <ArrowLeft aria-hidden className={buttonIconStyles({ size })} />
        <Slottable>{asChild ? children : null}</Slottable>
        <span>{label}</span>
      </Comp>
    );
  },
);

BackButton.displayName = 'BackButton';
