'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { cn } from '../../lib/cn';
import { tabsListStyles } from './Tabs.styles';
import { TabsVariantContext } from './TabsContext';

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    const variant = useContext(TabsVariantContext);
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListStyles({ variant }), className)}
        {...props}
      />
    );
  },
);

TabsList.displayName = 'TabsList';
