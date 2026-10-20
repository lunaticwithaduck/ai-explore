import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Basic',
    priceCents: 1000,
    period: 'month',
    features: [
      { en: '200 images/month', bg: '200 изображения на месец' },
      { en: 'Standard quality', bg: 'Стандартно качество' },
      { en: 'Community support', bg: 'Поддръжка от общността' },
    ],
  },
  {
    name: 'Standard',
    priceCents: 3000,
    period: 'month',
    features: [
      { en: 'Unlimited images', bg: 'Неограничени изображения' },
      { en: 'High quality', bg: 'Високо качество' },
      { en: 'Fast mode', bg: 'Бърз режим' },
      { en: 'Priority support', bg: 'Приоритетна поддръжка' },
    ],
    popular: true,
  },
  {
    name: 'Pro',
    priceCents: 6000,
    period: 'month',
    features: [
      { en: 'Everything in Standard', bg: 'Всичко от Standard' },
      { en: '4K resolution', bg: '4K резолюция' },
      { en: 'Stealth mode', bg: 'Скрит режим' },
      { en: 'Commercial license', bg: 'Търговски лиценз' },
    ],
  },
];

export const midJourney: Tool = {
  slug: 'midjourney',
  name: 'MidJourney',
  developer: 'MidJourney Inc.',
  websiteUrl: 'https://www.midjourney.com',
  tagline: {
    en: 'Generate stunning images from text descriptions with AI',
    bg: 'Създавайте впечатляващи изображения от текстово описание с ИИ',
  },
  description: {
    en: 'MidJourney is a leading AI image generation tool that creates stunning visualizations from simple text descriptions. Perfect for artists, designers, and creators.',
    bg: 'MidJourney е водещ инструмент за генериране на изображения с ИИ, който създава впечатляващи визуализации от прости текстови описания. Идеален за художници, дизайнери и творци.',
  },
  categoryId: 'image',
  tags: ['ai-art', 'generation', 'design'],
  logo: { path: '/logos/midjourney.png', background: '#7DD3FC' },
  pricing: buildPricing(plans, false, 25),
  plans: plans,
  features: [
    { en: 'High Resolution', bg: 'Висока резолюция' },
    { en: 'Multiple Styles', bg: 'Множество стилове' },
    { en: 'Fast Generation', bg: 'Бързо генериране' },
    { en: 'API Access', bg: 'Достъп до API' },
  ],
  tutorials: [
    {
      youtubeId: 'aodE4be2t-g',
      title: {
        en: 'FULL 2026 Midjourney AI Tutorial (for Beginners)',
        bg: 'Пълен урок за Midjourney 2026 (за начинаещи)',
      },
      durationMin: 37,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'NKRvL63A--E',
      title: {
        en: 'MidJourney - EASY Beginner Guide to Get Started',
        bg: 'Midjourney - лесно ръководство за начинаещи',
      },
      durationMin: 7,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'Ziv-MtqMEr0',
      title: {
        en: 'How to Get Started With Midjourney: 10-Minute Tutorial for Beginners',
        bg: 'Как да започнем с Midjourney: 10-минутен урок за начинаещи',
      },
      durationMin: 11,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'B1hOFU-Wzf8',
      title: {
        en: 'Level Up Your Prompts in Midjourney V6! - Generate Better Ai Images',
        bg: 'Подобрете промптовете си в Midjourney V6! - Генерирайте по-добри ИИ изображения',
      },
      durationMin: 17,
      difficulty: 'intermediate',
    },
    {
      youtubeId: 'NM_pnGGdsac',
      title: {
        en: '2025 Midjourney Full Guide - Beginner to Pro',
        bg: 'Пълно ръководство за Midjourney 2025 - от начинаещ до професионалист',
      },
      durationMin: 27,
      difficulty: 'advanced',
    },
  ],
  comparison: {
    apiAccess: 'full',
    integrations: 50,
    speed: 4,
    outputQuality: 5,
    bestUseCase: {
      en: 'High-quality artistic images and creative design work',
      bg: 'Висококачествени художествени изображения и творческа дизайнерска работа',
    },
  },
  similarToolIds: ['stable-diffusion'],
  complementaryToolIds: ['chatgpt', 'runway', 'elevenlabs'],
  rating: ratingOf('midjourney'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(3),
  lastReleaseAt: daysAgo(3),
};
