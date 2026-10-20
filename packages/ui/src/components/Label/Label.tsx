'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import type { VariantProps } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { labelStyles } from './Label.styles';

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelStyles>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size, tone, className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelStyles({ size, tone }), className)}
      {...props}
    />
  ),
);

Label.displayName = 'Label';
