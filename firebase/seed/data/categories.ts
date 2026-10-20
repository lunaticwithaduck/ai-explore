import type { Category } from '@ai-explore/schemas';

export const categories: Record<string, Category> = {
  image: {
    name: { en: 'Image Generation', bg: 'Генериране на изображения' },
    icon: 'image',
    order: 0,
  },
  text: { name: { en: 'Text & Writing', bg: 'Текст и писане' }, icon: 'type', order: 1 },
  video: { name: { en: 'Video', bg: 'Видео' }, icon: 'video', order: 2 },
  audio: { name: { en: 'Audio & Voice', bg: 'Аудио и глас' }, icon: 'music', order: 3 },
  code: { name: { en: 'Code Assistant', bg: 'Помощник за код' }, icon: 'code', order: 4 },
  analytics: { name: { en: 'Analytics', bg: 'Аналитика' }, icon: 'chart-bar', order: 5 },
};
