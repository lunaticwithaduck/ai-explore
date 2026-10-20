import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Creator',
    priceCents: 3900,
    period: 'month',
    features: [
      { en: '1 user', bg: '1 потребител' },
      { en: '50,000 words/month', bg: '50 000 думи на месец' },
      { en: '50+ templates', bg: 'Над 50 шаблона' },
      { en: 'SEO mode', bg: 'SEO режим' },
    ],
  },
  {
    name: 'Teams',
    priceCents: 9900,
    period: 'month',
    features: [
      { en: '3 users', bg: '3 потребители' },
      { en: '150,000 words/month', bg: '150 000 думи на месец' },
      { en: 'Brand voice', bg: 'Глас на марката' },
      { en: 'Collaboration tools', bg: 'Инструменти за съвместна работа' },
    ],
    popular: true,
  },
  {
    name: 'Business',
    priceCents: null,
    period: 'custom',
    features: [
      { en: 'Unlimited users', bg: 'Неограничен брой потребители' },
      { en: 'Custom words', bg: 'Персонализиран лимит на думи' },
      { en: 'API access', bg: 'Достъп до API' },
      { en: 'Dedicated support', bg: 'Специализирана поддръжка' },
      { en: 'Custom templates', bg: 'Персонализирани шаблони' },
    ],
  },
];

export const jasper: Tool = {
  slug: 'jasper',
  name: 'Jasper AI',
  developer: 'Jasper AI Inc.',
  websiteUrl: 'https://www.jasper.ai',
  tagline: {
    en: 'AI platform for marketing and copywriting',
    bg: 'ИИ платформа за маркетинг и копирайтинг',
  },
  description: {
    en: 'Jasper AI is a specialized AI tool for creating marketing materials, blog posts, and advertising copy.',
    bg: 'Jasper AI е специализиран ИИ инструмент за създаване на маркетингови материали, блог публикации и рекламни текстове.',
  },
  categoryId: 'text',
  tags: ['marketing', 'copywriting', 'seo'],
  logo: { path: '/logos/jasper.png', background: '#FF8C42' },
  pricing: buildPricing(plans, false, 7),
  plans: plans,
  features: [
    { en: 'SEO Optimization', bg: 'SEO оптимизация' },
    { en: 'Templates', bg: 'Шаблони' },
    { en: 'Brand Voice', bg: 'Глас на марката' },
    { en: 'Team Collaboration', bg: 'Съвместна работа в екип' },
  ],
  tutorials: [
    {
      youtubeId: 'U5naGpqFcww',
      title: {
        en: 'Jasper AI Beginners Tutorial 2026 (COMPLETE STEP-BY-STEP)',
        bg: 'Урок за Jasper AI за начинаещи 2026 (ПЪЛНО РЪКОВОДСТВО СТЪПКА ПО СТЪПКА)',
      },
      durationMin: 9,
      difficulty: 'beginner',
    },
    {
      youtubeId: '7KbscTkFhDU',
      title: {
        en: 'How to Use Jasper AI for Beginners in 2025: Ultimate Tutorial',
        bg: 'Как да използвате Jasper AI като начинаещ през 2025: Най-добрият урок',
      },
      durationMin: 10,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'Z_aZNoFBvLk',
      title: {
        en: 'Jasper AI Tutorial for Beginners (2024) Full Guide',
        bg: 'Урок за Jasper AI за начинаещи (2024) - пълно ръководство',
      },
      durationMin: 27,
      difficulty: 'intermediate',
    },
    {
      youtubeId: 'Dp7pFsQrris',
      title: {
        en: 'Jasper AI Tutorial For Beginners (2024)',
        bg: 'Урок за Jasper AI за начинаещи (2024)',
      },
      durationMin: 25,
      difficulty: 'intermediate',
    },
    {
      youtubeId: 'vs8l1xWwYqo',
      title: {
        en: 'Jasper AI Tutorial 1 - Beginner Basics',
        bg: 'Урок 1 за Jasper AI - основи за начинаещи',
      },
      durationMin: 27,
      difficulty: 'beginner',
    },
  ],
  comparison: {
    apiAccess: 'full',
    integrations: 60,
    speed: 4,
    outputQuality: 4,
    bestUseCase: {
      en: 'Marketing copy, blog posts, and business content',
      bg: 'Маркетингови текстове, блог публикации и бизнес съдържание',
    },
  },
  similarToolIds: ['chatgpt'],
  complementaryToolIds: ['midjourney', 'tableau-ai', 'elevenlabs'],
  rating: ratingOf('jasper'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(15),
  lastReleaseAt: daysAgo(15),
};
