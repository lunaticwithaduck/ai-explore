'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { type TabsVariant, TabsVariantContext } from './TabsContext';

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
  variant?: TabsVariant | undefined;
};

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ variant = 'underline', ...props }, ref) => (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root ref={ref} {...props} />
    </TabsVariantContext.Provider>
  ),
);

Tabs.displayName = 'Tabs';
