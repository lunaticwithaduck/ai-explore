import type { UPDATE_KINDS } from '@ai-explore/schemas';
import { Bug, type LucideIcon, Sparkles, TrendingUp } from 'lucide-react';

type UpdateKind = (typeof UPDATE_KINDS)[number];

export const UPDATE_KIND_ICON: Record<UpdateKind, LucideIcon> = {
  feature: Sparkles,
  improvement: TrendingUp,
  bugfix: Bug,
};

export const YOUTUBE_THUMBNAIL_HOST = 'https://i.ytimg.com/vi';
export const YOUTUBE_EMBED_HOST = 'https://www.youtube-nocookie.com/embed';
