import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Open Source',
    priceCents: 0,
    period: 'month',
    features: [
      { en: 'Self-hosted', bg: 'Самостоятелно хостване' },
      { en: 'Unlimited generations', bg: 'Неограничено генериране' },
      { en: 'Community models', bg: 'Модели от общността' },
      { en: 'Full control', bg: 'Пълен контрол' },
    ],
    popular: true,
  },
  {
    name: 'DreamStudio',
    priceCents: null,
    period: 'custom',
    features: [
      { en: 'Cloud-based', bg: 'В облака' },
      { en: 'Pay per image', bg: 'Плащане за изображение' },
      { en: 'No setup required', bg: 'Без нужда от настройка' },
      { en: 'API access', bg: 'Достъп до API' },
    ],
  },
];

export const stableDiffusion: Tool = {
  slug: 'stable-diffusion',
  name: 'Stable Diffusion',
  developer: 'Stability AI',
  websiteUrl: 'https://stability.ai',
  tagline: {
    en: 'Open-source AI for image generation',
    bg: 'ИИ с отворен код за генериране на изображения',
  },
  description: {
    en: 'Stable Diffusion is a powerful open-source image generation model that you can use locally or in the cloud.',
    bg: 'Stable Diffusion е мощен модел с отворен код за генериране на изображения, който можете да ползвате локално или в облака.',
  },
  categoryId: 'image',
  tags: ['open-source', 'image-gen', 'free'],
  logo: { path: '/logos/stable-diffusion.png', background: '#FCD9A8' },
  pricing: buildPricing(plans, true),
  plans: plans,
  features: [
    { en: 'Open Source', bg: 'Отворен код' },
    { en: 'Local Execution', bg: 'Локално изпълнение' },
    { en: 'Extensible', bg: 'Разширяемост' },
    { en: 'Community Models', bg: 'Модели от общността' },
  ],
  tutorials: [
    {
      youtubeId: 'B5VzYIc02RE',
      title: {
        en: 'How to use Stable Diffusion for Beginners',
        bg: 'Как да използвате Stable Diffusion за начинаещи',
      },
      durationMin: 8,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'xLn1LL5N5b0',
      title: {
        en: 'How To Install & Run Stable Diffusion for Dummies',
        bg: 'Как да инсталирате и стартирате Stable Diffusion - за напълно начинаещи',
      },
      durationMin: 19,
      difficulty: 'beginner',
    },
    {
      youtubeId: '3cvP7yJotUM',
      title: {
        en: 'Install Automatic 1111 WITH automated Updates - super easy #gitpull #stablediffusion',
        bg: 'Инсталирайте Automatic 1111 с автоматични актуализации - супер лесно',
      },
      durationMin: 8,
      difficulty: 'advanced',
    },
    {
      youtubeId: '70H03cv57-o',
      title: {
        en: 'ULTIMATE FREE LORA Training In Stable Diffusion! Less Than 7GB VRAM!',
        bg: 'НАЙ-ДОБРОТО БЕЗПЛАТНО обучение на LORA в Stable Diffusion! Под 7GB VRAM!',
      },
      durationMin: 21,
      difficulty: 'advanced',
    },
    {
      youtubeId: 'dMkiOex_cKU',
      title: {
        en: 'Stable Diffusion Crash Course for Beginners',
        bg: 'Ускорен курс по Stable Diffusion за начинаещи',
      },
      durationMin: 61,
      difficulty: 'intermediate',
    },
  ],
  comparison: {
    apiAccess: 'full',
    integrations: 150,
    speed: 4,
    outputQuality: 5,
    bestUseCase: {
      en: 'Open-source image generation with full customization',
      bg: 'Генериране на изображения с отворен код и пълна персонализация',
    },
  },
  similarToolIds: ['midjourney'],
  complementaryToolIds: ['chatgpt', 'runway', 'elevenlabs'],
  rating: ratingOf('stable-diffusion'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(30),
  lastReleaseAt: daysAgo(30),
};
