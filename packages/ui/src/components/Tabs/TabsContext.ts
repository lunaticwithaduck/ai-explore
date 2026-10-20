import { createContext } from 'react';

export type TabsVariant = 'underline' | 'pill';

export const TabsVariantContext = createContext<TabsVariant>('underline');
