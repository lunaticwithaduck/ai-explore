import {
  Briefcase,
  Code,
  type LucideIcon,
  Package,
  Rocket,
  Scale,
  Sparkles,
  TrendingUp,
  Video,
} from 'lucide-react';

const BUNDLE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  video: Video,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  scale: Scale,
  sparkles: Sparkles,
  code: Code,
};

export function bundleIcon(name: string): LucideIcon {
  return BUNDLE_ICONS[name] ?? Package;
}
