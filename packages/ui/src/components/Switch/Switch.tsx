'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { switchStyles, switchThumbStyles } from './Switch.styles';

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'md' | undefined;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size, className, ...props }, ref) => (
    <SwitchPrimitive.Root ref={ref} className={cn(switchStyles({ size }), className)} {...props}>
      <SwitchPrimitive.Thumb className={switchThumbStyles({ size })} />
    </SwitchPrimitive.Root>
  ),
);

Switch.displayName = 'Switch';
