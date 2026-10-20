import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Free',
    priceCents: 0,
    period: 'month',
    features: [
      { en: '10,000 characters/month', bg: '10 000 знака на месец' },
      { en: '3 custom voices', bg: '3 персонализирани гласа' },
      { en: 'Standard quality', bg: 'Стандартно качество' },
    ],
  },
  {
    name: 'Starter',
    priceCents: 500,
    period: 'month',
    features: [
      { en: '30,000 characters/month', bg: '30 000 знака на месец' },
      { en: '10 custom voices', bg: '10 персонализирани гласа' },
      { en: 'High quality', bg: 'Високо качество' },
      { en: 'Commercial license', bg: 'Търговски лиценз' },
    ],
  },
  {
    name: 'Creator',
    priceCents: 2200,
    period: 'month',
    features: [
      { en: '100,000 characters/month', bg: '100 000 знака на месец' },
      { en: '30 custom voices', bg: '30 персонализирани гласа' },
      { en: 'Voice cloning', bg: 'Клониране на глас' },
      { en: 'Priority support', bg: 'Приоритетна поддръжка' },
    ],
    popular: true,
  },
  {
    name: 'Pro',
    priceCents: 9900,
    period: 'month',
    features: [
      { en: '500,000 characters/month', bg: '500 000 знака на месец' },
      { en: 'Unlimited voices', bg: 'Неограничени гласове' },
      { en: 'Advanced cloning', bg: 'Разширено клониране' },
      { en: 'API access', bg: 'Достъп до API' },
    ],
  },
];

export const elevenLabs: Tool = {
  slug: 'elevenlabs',
  name: 'ElevenLabs',
  developer: 'ElevenLabs',
  websiteUrl: 'https://elevenlabs.io',
  tagline: {
    en: 'Realistic AI voice synthesis and cloning',
    bg: 'Реалистичен ИИ синтез и клониране на глас',
  },
  description: {
    en: 'ElevenLabs offers the most realistic AI voice technology for creating professional voiceovers and voice cloning.',
    bg: 'ElevenLabs предлага най-реалистичната технология за ИИ глас за създаване на професионални озвучавания и клониране на глас.',
  },
  categoryId: 'audio',
  tags: ['voice', 'tts', 'voiceover'],
  logo: { path: '/logos/elevenlabs.png', background: '#FDBA74' },
  pricing: buildPricing(plans, true),
  plans: plans,
  features: [
    { en: 'Voice Cloning', bg: 'Клониране на глас' },
    { en: '29 Languages', bg: '29 езика' },
    { en: 'API', bg: 'API' },
    { en: 'High Accuracy', bg: 'Висока точност' },
  ],
  tutorials: [
    {
      youtubeId: 'yDTbAxJ3sKI',
      title: {
        en: 'How to Use ElevenLabs AI (Complete Beginner Tutorial)',
        bg: 'Как да използвате ElevenLabs AI (пълен урок за начинаещи)',
      },
      durationMin: 11,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'lVqg3Up_oLM',
      title: {
        en: 'Elevenlabs Tutorial for Beginners 2026 (Step-by-Step Guide)',
        bg: 'Урок за ElevenLabs за начинаещи 2026 (ръководство стъпка по стъпка)',
      },
      durationMin: 9,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'QGSAvB45lNY',
      title: {
        en: 'ElevenLabs Tutorial: Full Demo of Features, Pricing, and Setup in 2025',
        bg: 'Урок за ElevenLabs: пълна демонстрация на функциите, цените и настройката през 2025',
      },
      durationMin: 9,
      difficulty: 'intermediate',
    },
    {
      youtubeId: 'Zozt9QfAwcg',
      title: {
        en: "The Only ElevenLabs Tutorial You'll Need (2026)",
        bg: 'Единственият урок за ElevenLabs, който ще ви трябва (2026)',
      },
      durationMin: 30,
      difficulty: 'advanced',
    },
  ],
  comparison: {
    apiAccess: 'full',
    integrations: 30,
    speed: 4,
    outputQuality: 5,
    bestUseCase: {
      en: 'Professional voice synthesis and text-to-speech',
      bg: 'Професионален синтез на глас и преобразуване на текст в реч',
    },
  },
  similarToolIds: [],
  complementaryToolIds: ['runway', 'stable-diffusion', 'chatgpt'],
  rating: ratingOf('elevenlabs'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(25),
  lastReleaseAt: daysAgo(25),
};
