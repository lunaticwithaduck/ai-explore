import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Free',
    priceCents: 0,
    period: 'month',
    features: [
      { en: 'For students and open source', bg: 'За студенти и отворен код' },
      { en: 'Code completion', bg: 'Допълване на код' },
      { en: 'Multi-language support', bg: 'Поддръжка на много езици' },
    ],
  },
  {
    name: 'Individual',
    priceCents: 1000,
    period: 'month',
    features: [
      { en: 'Unlimited code suggestions', bg: 'Неограничени предложения за код' },
      { en: 'Multi-language', bg: 'Много езици' },
      { en: 'IDE integration', bg: 'Интеграция с IDE' },
      { en: 'Chat in IDE', bg: 'Чат в IDE' },
    ],
    popular: true,
  },
  {
    name: 'Business',
    priceCents: 1900,
    period: 'month',
    features: [
      { en: 'Everything in Individual', bg: 'Всичко от Individual' },
      { en: 'License management', bg: 'Управление на лицензи' },
      { en: 'Organization policies', bg: 'Политики на организацията' },
      { en: 'Security features', bg: 'Функции за сигурност' },
    ],
  },
];

export const githubCopilot: Tool = {
  slug: 'github-copilot',
  name: 'GitHub Copilot',
  developer: 'GitHub',
  websiteUrl: 'https://github.com/features/copilot',
  tagline: {
    en: 'AI pair programmer for real-time coding assistance',
    bg: 'ИИ партньор за програмиране с помощ в реално време',
  },
  description: {
    en: 'GitHub Copilot is your AI programming partner that helps you write code faster and more efficiently with intelligent suggestions.',
    bg: 'GitHub Copilot е вашият ИИ партньор за програмиране, който ви помага да пишете код по-бързо и по-ефективно с интелигентни предложения.',
  },
  categoryId: 'code',
  tags: ['coding', 'ide', 'productivity'],
  logo: { path: '/logos/github-copilot.png', background: '#BFDBFE' },
  pricing: buildPricing(plans, true, 30),
  plans: plans,
  features: [
    { en: 'Code Completion', bg: 'Допълване на код' },
    { en: 'Multi-language', bg: 'Много езици' },
    { en: 'IDE Integration', bg: 'Интеграция с IDE' },
    { en: 'Code Review', bg: 'Преглед на код' },
  ],
  tutorials: [
    {
      youtubeId: 'hPVatUSvZq0',
      title: { en: 'GitHub Copilot in 7 Minutes 👨‍💻🤖🚀', bg: 'GitHub Copilot за 7 минути' },
      durationMin: 7,
      difficulty: 'beginner',
    },
    {
      youtubeId: '2nPoiUJpDaU',
      title: {
        en: 'GitHub Copilot in VSCode: Top 10 Features Explained',
        bg: 'GitHub Copilot във VSCode: обяснени 10-те най-добри функции',
      },
      durationMin: 9,
      difficulty: 'intermediate',
    },
    {
      youtubeId: '3surPGP7_4o',
      title: {
        en: 'GitHub Copilot: Getting Started with Chat',
        bg: 'GitHub Copilot: първи стъпки с чата',
      },
      durationMin: 4,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'CwAzIpc4AnA',
      title: {
        en: 'Pragmatic techniques to get the most out of GitHub Copilot | BRK255H',
        bg: 'Прагматични техники за извличане на максимума от GitHub Copilot | BRK255H',
      },
      durationMin: 46,
      difficulty: 'advanced',
    },
  ],
  comparison: {
    apiAccess: 'limited',
    integrations: 80,
    speed: 5,
    outputQuality: 4,
    bestUseCase: {
      en: 'Code completion and programming assistance',
      bg: 'Допълване на код и помощ при програмиране',
    },
  },
  similarToolIds: ['chatgpt'],
  complementaryToolIds: ['tableau-ai', 'chatgpt'],
  rating: ratingOf('github-copilot'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(10),
  lastReleaseAt: daysAgo(10),
};
