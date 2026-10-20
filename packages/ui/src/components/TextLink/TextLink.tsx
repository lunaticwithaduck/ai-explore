import { Slot, Slottable } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { type AnchorHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { textLinkStyles } from './TextLink.styles';

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof textLinkStyles> & {
    asChild?: boolean;
    iconRight?: LucideIcon | undefined;
    className?: string | undefined;
  };

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    { asChild = false, tone, underline, size, iconRight: IconRight, className, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        className={cn(textLinkStyles({ tone, underline, size }), className)}
        {...props}
      >
        <Slottable>{children}</Slottable>
        {IconRight && <IconRight aria-hidden className="size-3.5 shrink-0" />}
      </Comp>
    );
  },
);

TextLink.displayName = 'TextLink';
