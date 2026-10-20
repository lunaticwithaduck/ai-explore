'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { LucideIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { cn } from '../../lib/cn';
import { tabsTriggerStyles } from './Tabs.styles';
import { TabsVariantContext } from './TabsContext';

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  icon?: LucideIcon | undefined;
};

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ icon: Icon, className, children, ...props }, ref) => {
    const variant = useContext(TabsVariantContext);
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(tabsTriggerStyles({ variant }), className)}
        {...props}
      >
        {Icon && <Icon aria-hidden className="size-4" />}
        {children}
      </TabsPrimitive.Trigger>
    );
  },
);

TabsTrigger.displayName = 'TabsTrigger';
