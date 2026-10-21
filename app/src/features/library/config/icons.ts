import { Clock, DollarSign, type LucideIcon, MessageSquare, TrendingUp } from 'lucide-react';
import type { SortKey } from './constants';

export const SORT_ICONS: Record<SortKey, LucideIcon> = {
  rating: TrendingUp,
  reviews: MessageSquare,
  priceAsc: DollarSign,
  priceDesc: DollarSign,
  newest: Clock,
};
