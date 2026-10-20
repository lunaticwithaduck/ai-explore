import { ACCENTS, COLLECTION_ICONS } from '@ai-explore/schemas';
import {
  Bookmark,
  Briefcase,
  Camera,
  ChartBar,
  Code,
  Folder,
  GraduationCap,
  Heart,
  type LucideIcon,
  Music,
  Palette,
  PenTool,
  Rocket,
  Sparkles,
  Star,
  Video,
  Zap,
} from 'lucide-react';

export type CollectionIconName = (typeof COLLECTION_ICONS)[number];

const COLLECTION_ICON_MAP: Record<CollectionIconName, LucideIcon> = {
  folder: Folder,
  briefcase: Briefcase,
  palette: Palette,
  code: Code,
  'pen-tool': PenTool,
  video: Video,
  music: Music,
  'chart-bar': ChartBar,
  sparkles: Sparkles,
  rocket: Rocket,
  heart: Heart,
  star: Star,
  bookmark: Bookmark,
  zap: Zap,
  'graduation-cap': GraduationCap,
  camera: Camera,
};

export const collectionIcon = (name: CollectionIconName): LucideIcon => COLLECTION_ICON_MAP[name];

export const COLLECTION_ICON_CYCLE = COLLECTION_ICONS;
export const COLLECTION_COLOR_CYCLE = ACCENTS;

export const SAVED_TAB = 'saved';
export const COLLECTION_PARAM = 'collection';
