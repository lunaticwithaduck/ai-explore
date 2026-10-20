import type { DIFFICULTIES, UPDATE_KINDS } from '@ai-explore/schemas';
import { Bug, type LucideIcon, Sparkles, TrendingUp } from 'lucide-react';

type Difficulty = (typeof DIFFICULTIES)[number];
type UpdateKind = (typeof UPDATE_KINDS)[number];
type BadgeTone = 'accent' | 'success' | 'warning' | 'danger';

export const UPDATE_KIND_STYLE: Record<UpdateKind, { icon: LucideIcon; tone: BadgeTone }> = {
  feature: { icon: Sparkles, tone: 'accent' },
  improvement: { icon: TrendingUp, tone: 'success' },
  bugfix: { icon: Bug, tone: 'danger' },
};

export const DIFFICULTY_TONE: Record<Difficulty, BadgeTone> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
};

export const YOUTUBE_THUMBNAIL_HOST = 'https://i.ytimg.com/vi';
export const YOUTUBE_EMBED_HOST = 'https://www.youtube-nocookie.com/embed';
