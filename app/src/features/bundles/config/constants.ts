import { Check, type LucideIcon, Sparkles, TrendingUp } from 'lucide-react';

export const MAX_STACKED_LOGOS = 4;

export const BUNDLE_BENEFITS: readonly {
  key: 'curated' | 'savings' | 'onePrice';
  icon: LucideIcon;
}[] = [
  { key: 'curated', icon: Check },
  { key: 'savings', icon: TrendingUp },
  { key: 'onePrice', icon: Sparkles },
];
