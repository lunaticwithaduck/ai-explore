import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Free',
    priceCents: 0,
    period: 'month',
    features: [
      { en: 'Limited access to the latest model', bg: 'Ограничен достъп до най-новия модел' },
      { en: 'Limited queries', bg: 'Ограничен брой заявки' },
      { en: 'Standard response time', bg: 'Стандартно време за отговор' },
    ],
  },
  {
    name: 'Plus',
    priceCents: 2000,
    period: 'month',
    features: [
      { en: 'Expanded model access', bg: 'Разширен достъп до моделите' },
      { en: 'Higher usage limits', bg: 'По-високи лимити на употреба' },
      { en: 'Faster responses', bg: 'По-бързи отговори' },
      { en: 'Priority access', bg: 'Приоритетен достъп' },
    ],
    popular: true,
  },
  {
    name: 'Team',
    priceCents: 2500,
    period: 'month',
    features: [
      { en: 'Everything in Plus', bg: 'Всичко от Plus' },
      { en: 'Admin console', bg: 'Административна конзола' },
      { en: 'Team workspace', bg: 'Работно пространство за екипи' },
      { en: 'Data privacy', bg: 'Защита на данните' },
    ],
  },
];

export const chatGpt: Tool = {
  slug: 'chatgpt',
  name: 'ChatGPT',
  developer: 'OpenAI',
  websiteUrl: 'https://chat.openai.com',
  tagline: {
    en: 'Most powerful AI assistant for any task',
    bg: 'Най-мощният ИИ асистент за всяка задача',
  },
  description: {
    en: 'ChatGPT offers the most advanced capabilities from OpenAI for text generation, analysis, and assistance with any task.',
    bg: 'ChatGPT предлага най-напредналите възможности на OpenAI за генериране на текст, анализ и помощ при всякаква задача.',
  },
  categoryId: 'text',
  tags: ['chat', 'writing', 'analysis'],
  logo: { path: '/logos/chatgpt.png', background: '#1A1A1A' },
  pricing: buildPricing(plans, true),
  plans: plans,
  features: [
    { en: 'Conversational Assistant', bg: 'Разговорен асистент' },
    { en: 'Advanced Models', bg: 'Усъвършенствани модели' },
    { en: 'Document Analysis', bg: 'Анализ на документи' },
    { en: 'Browser Integration', bg: 'Интеграция с браузър' },
  ],
  tutorials: [
    {
      youtubeId: 'JTxsNm9IdYU',
      title: {
        en: 'ChatGPT Tutorial - A Crash Course on Chat GPT for Beginners',
        bg: 'ChatGPT урок - ускорен курс по Chat GPT за начинаещи',
      },
      durationMin: 34,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'jC4v5AS4RIM',
      title: {
        en: 'Master the Perfect ChatGPT Prompt Formula (in just 8 minutes)!',
        bg: 'Овладейте перфектната формула за промпт в ChatGPT (само за 8 минути)!',
      },
      durationMin: 8,
      difficulty: 'intermediate',
    },
    {
      youtubeId: 'VznoKyh6AXs',
      title: {
        en: "How to learn to code FAST using ChatGPT (it's a game changer seriously)",
        bg: 'Как да се научите да програмирате БЪРЗО с ChatGPT (наистина променя играта)',
      },
      durationMin: 22,
      difficulty: 'intermediate',
    },
    {
      youtubeId: 'hTAsWGTK6wY',
      title: {
        en: 'FULL ChatGPT Tutorial For Beginners in 2026! (FULL COURSE)',
        bg: 'ПЪЛЕН урок по ChatGPT за начинаещи през 2026! (ПЪЛЕН КУРС)',
      },
      durationMin: 111,
      difficulty: 'beginner',
    },
  ],
  comparison: {
    apiAccess: 'full',
    integrations: 100,
    speed: 5,
    outputQuality: 5,
    bestUseCase: {
      en: 'Conversational AI, text generation, and code assistance',
      bg: 'Разговорен ИИ, генериране на текст и помощ при програмиране',
    },
  },
  similarToolIds: ['jasper'],
  complementaryToolIds: ['midjourney', 'github-copilot', 'tableau-ai'],
  rating: ratingOf('chatgpt'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(12),
  lastReleaseAt: daysAgo(12),
};
