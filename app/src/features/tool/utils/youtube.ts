import { YOUTUBE_EMBED_HOST, YOUTUBE_THUMBNAIL_HOST } from '../config/constants';

export const thumbnailUrl = (youtubeId: string) =>
  `${YOUTUBE_THUMBNAIL_HOST}/${youtubeId}/hqdefault.jpg`;

export const embedUrl = (youtubeId: string) => `${YOUTUBE_EMBED_HOST}/${youtubeId}?autoplay=1`;
