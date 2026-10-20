import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Free',
    priceCents: 0,
    period: 'month',
    features: [
      { en: '125 credits/month', bg: '125 кредита на месец' },
      { en: '720p export', bg: 'Експорт в 720p' },
      { en: 'Watermarked', bg: 'С воден знак' },
    ],
  },
  {
    name: 'Standard',
    priceCents: 1200,
    period: 'month',
    features: [
      { en: '625 credits/month', bg: '625 кредита на месец' },
      { en: '1080p export', bg: 'Експорт в 1080p' },
      { en: 'No watermark', bg: 'Без воден знак' },
    ],
    popular: true,
  },
  {
    name: 'Pro',
    priceCents: 2800,
    period: 'month',
    features: [
      { en: '2250 credits/month', bg: '2250 кредита на месец' },
      { en: '4K export', bg: 'Експорт в 4K' },
      { en: 'Priority processing', bg: 'Приоритетна обработка' },
      { en: 'Team workspace', bg: 'Работно пространство за екипи' },
    ],
  },
  {
    name: 'Unlimited',
    priceCents: 7600,
    period: 'month',
    features: [
      { en: 'Unlimited credits', bg: 'Неограничени кредити' },
      { en: '4K export', bg: 'Експорт в 4K' },
      { en: 'Fastest processing', bg: 'Най-бърза обработка' },
      { en: 'Premium support', bg: 'Премиум поддръжка' },
    ],
  },
];

export const runway: Tool = {
  slug: 'runway',
  name: 'Runway ML',
  developer: 'Runway Research',
  websiteUrl: 'https://runwayml.com',
  tagline: {
    en: 'Professional video editing and generation with AI',
    bg: 'Професионално редактиране и генериране на видео с ИИ',
  },
  description: {
    en: 'Runway ML revolutionizes video production with AI technologies for generating, editing, and enhancing video content.',
    bg: 'Runway ML променя видеопродукцията с технологии на ИИ за генериране, редактиране и подобряване на видео съдържание.',
  },
  categoryId: 'video',
  tags: ['video', 'editing', 'effects'],
  logo: { path: '/logos/runway.png', background: '#FFFFFF' },
  pricing: buildPricing(plans, true, 14),
  plans: plans,
  features: [
    { en: 'Text to Video', bg: 'Текст във видео' },
    { en: 'AI Effects', bg: 'ИИ ефекти' },
    { en: '4K Export', bg: 'Експорт в 4K' },
    { en: 'Green Screen', bg: 'Зелен екран' },
  ],
  tutorials: [
    {
      youtubeId: 'FqYRkl12ON8',
      title: {
        en: 'Runway AI - Tutorial for Beginners in 17 MINUTES !  [ FULL GUIDE ]',
        bg: 'Runway AI - урок за начинаещи за 17 МИНУТИ! [ ПЪЛНО РЪКОВОДСТВО ]',
      },
      durationMin: 18,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'oYNzl4Hzi4M',
      title: {
        en: 'Getting Started with Gen-3 Alpha | Runway Academy',
        bg: 'Първи стъпки с Gen-3 Alpha | Runway Academy',
      },
      durationMin: 3,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'd7oxhBrx4v8',
      title: {
        en: 'How To Use Runway Gen-3 Alpha - (Runway Gen-3 Tutorial) - Gen 3 Alpha Guide',
        bg: 'Как да използвате Runway Gen-3 Alpha - (урок за Runway Gen-3) - ръководство за Gen 3 Alpha',
      },
      durationMin: 18,
      difficulty: 'intermediate',
    },
    {
      youtubeId: 'zfxZXBp9_50',
      title: {
        en: 'How to Use Runway Gen 3 Full Guide 2026',
        bg: 'Как да използвате Runway Gen 3 - пълно ръководство 2026',
      },
      durationMin: 2,
      difficulty: 'intermediate',
    },
  ],
  comparison: {
    apiAccess: 'full',
    integrations: 40,
    speed: 3,
    outputQuality: 5,
    bestUseCase: {
      en: 'AI video generation and editing for creative professionals',
      bg: 'Генериране и редактиране на видео с ИИ за творчески професионалисти',
    },
  },
  similarToolIds: [],
  complementaryToolIds: ['midjourney', 'elevenlabs', 'stable-diffusion'],
  rating: ratingOf('runway'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(20),
  lastReleaseAt: daysAgo(20),
};
