import {
  ChartBar,
  Code,
  ImageIcon,
  type LucideIcon,
  Music,
  PenTool,
  Shapes,
  Type,
  Video,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  image: ImageIcon,
  type: Type,
  video: Video,
  music: Music,
  code: Code,
  'chart-bar': ChartBar,
  'pen-tool': PenTool,
};

export const categoryIcon = (name: string): LucideIcon => CATEGORY_ICONS[name] ?? Shapes;
