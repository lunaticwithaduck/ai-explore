'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { avatarStyles } from './Avatar.styles';

export type AvatarProps = Omit<
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
  'children'
> & {
  src?: string | null | undefined;
  alt: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, size, className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn(avatarStyles({ size }), className)} {...props}>
      {src && <AvatarPrimitive.Image src={src} alt={alt} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback className="flex size-full items-center justify-center font-semibold text-text-muted uppercase">
        <span aria-hidden>{fallback}</span>
        {alt && <span className="sr-only">{alt}</span>}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  ),
);

Avatar.displayName = 'Avatar';
