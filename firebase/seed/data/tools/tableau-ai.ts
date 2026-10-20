import type { Plan, Tool } from '@ai-explore/schemas';
import { buildPricing, daysAgo } from '../helpers';
import { ratingOf } from '../reviews';

const plans: Plan[] = [
  {
    name: 'Viewer',
    priceCents: 1500,
    period: 'month',
    features: [
      { en: 'View dashboards', bg: 'Преглед на табла' },
      { en: 'Basic interactions', bg: 'Основни взаимодействия' },
      { en: 'Mobile access', bg: 'Мобилен достъп' },
    ],
  },
  {
    name: 'Explorer',
    priceCents: 4200,
    period: 'month',
    features: [
      { en: 'Create dashboards', bg: 'Създаване на табла' },
      { en: 'Data exploration', bg: 'Изследване на данни' },
      { en: 'Limited data sources', bg: 'Ограничени източници на данни' },
    ],
    popular: true,
  },
  {
    name: 'Creator',
    priceCents: 7000,
    period: 'month',
    features: [
      { en: 'Everything in Explorer', bg: 'Всичко от Explorer' },
      { en: 'Unlimited data sources', bg: 'Неограничени източници на данни' },
      { en: 'Data prep', bg: 'Подготовка на данни' },
      { en: 'Full authoring', bg: 'Пълни възможности за създаване' },
    ],
  },
];

export const tableauAi: Tool = {
  slug: 'tableau-ai',
  name: 'Tableau AI',
  developer: 'Salesforce',
  websiteUrl: 'https://www.tableau.com',
  tagline: {
    en: 'Intelligent data analysis and visualization',
    bg: 'Интелигентен анализ и визуализация на данни',
  },
  description: {
    en: 'Tableau AI combines powerful data visualization with AI capabilities for predictive analysis and automated data understanding.',
    bg: 'Tableau AI съчетава мощна визуализация на данни с възможности на ИИ за предсказващ анализ и автоматизирано разбиране на данните.',
  },
  categoryId: 'analytics',
  tags: ['data', 'visualization', 'bi'],
  logo: { path: '/logos/tableau-ai.png', background: '#F8F9FA' },
  pricing: buildPricing(plans, false, 14),
  plans: plans,
  features: [
    { en: 'Predictive Analytics', bg: 'Предсказваща аналитика' },
    { en: 'Natural Language', bg: 'Естествен език' },
    { en: 'Dashboards', bg: 'Табла' },
    { en: 'Integration', bg: 'Интеграции' },
  ],
  tutorials: [
    {
      youtubeId: 'X5Fl8_zjt0U',
      title: {
        en: 'Tableau Tutorial for Beginners | Create Your First Dashboard',
        bg: 'Урок за Tableau за начинаещи | Създайте първото си табло',
      },
      durationMin: 13,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'jEgVto5QME8',
      title: {
        en: 'Tableau Basics for Beginners - Tableau in Two Minutes',
        bg: 'Основи на Tableau за начинаещи - Tableau за две минути',
      },
      durationMin: 23,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'yPmUOmg_FTs',
      title: {
        en: 'The Only Tableau Tutorial You Need to Get Started',
        bg: 'Единственият урок за Tableau, който ви трябва, за да започнете',
      },
      durationMin: 22,
      difficulty: 'beginner',
    },
    {
      youtubeId: 'TKG1_6lw1_c',
      title: {
        en: 'Build An Interactive Tableau Dashboard - Start to Finish',
        bg: 'Изградете интерактивно табло в Tableau - от начало до край',
      },
      durationMin: 24,
      difficulty: 'intermediate',
    },
  ],
  comparison: {
    apiAccess: 'full',
    integrations: 200,
    speed: 4,
    outputQuality: 5,
    bestUseCase: {
      en: 'Business intelligence and data visualization',
      bg: 'Бизнес анализ и визуализация на данни',
    },
  },
  similarToolIds: [],
  complementaryToolIds: ['chatgpt', 'github-copilot', 'stable-diffusion'],
  rating: ratingOf('tableau-ai'),
  published: true,
  createdAt: daysAgo(120),
  updatedAt: daysAgo(18),
  lastReleaseAt: daysAgo(18),
};
