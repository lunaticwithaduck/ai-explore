import type { Bundle } from '@ai-explore/schemas';

export const bundles: Record<string, Bundle> = {
  'startup-founder-pack': {
    slug: 'startup-founder-pack',
    name: { en: 'Startup Founder Pack', bg: 'Стартъп пакет за основатели' },
    description: {
      en: 'Everything you need to launch and grow your startup, from content creation to analytics',
      bg: 'Всичко необходимо за стартиране и растеж на вашия стартъп - от създаване на съдържание до аналитика',
    },
    toolIds: ['chatgpt', 'jasper', 'tableau-ai', 'midjourney'],
    icon: 'rocket',
    accent: 'blue',
    pricing: {
      monthly: { priceCents: 6900 },
      quarterly: { priceCents: 18900 },
      yearly: { priceCents: 69900 },
    },
    published: true,
  },
  'ai-video-creator-stack': {
    slug: 'ai-video-creator-stack',
    name: { en: 'AI Video Creator Stack', bg: 'ИИ пакет за видео създатели' },
    description: {
      en: 'Complete video production toolkit with AI-powered editing, voice-over, and visual effects',
      bg: 'Пълен набор за видеопродукция с ИИ редактиране, озвучаване и визуални ефекти',
    },
    toolIds: ['runway', 'elevenlabs', 'midjourney'],
    icon: 'video',
    accent: 'violet',
    pricing: {
      monthly: { priceCents: 2200 },
      quarterly: { priceCents: 6500 },
      yearly: { priceCents: 24900 },
    },
    published: true,
  },
  'solo-agency-stack': {
    slug: 'solo-agency-stack',
    name: { en: 'Solo Agency Stack', bg: 'Пакет за соло агенция' },
    description: {
      en: 'Run your entire creative agency with AI: design, copy, video, and client reporting',
      bg: 'Управлявайте цялата си творческа агенция с ИИ - дизайн, текстове, видео и отчети за клиенти',
    },
    toolIds: ['midjourney', 'stable-diffusion', 'jasper', 'runway', 'tableau-ai'],
    icon: 'briefcase',
    accent: 'amber',
    pricing: {
      monthly: { priceCents: 6200 },
      quarterly: { priceCents: 17900 },
      yearly: { priceCents: 68900 },
    },
    published: true,
  },
  'ai-sdr-bundle': {
    slug: 'ai-sdr-bundle',
    name: { en: 'AI SDR Bundle', bg: 'ИИ пакет за търговски представители' },
    description: {
      en: 'Automate your sales outreach with AI-powered writing, voice messages, and analytics',
      bg: 'Автоматизирайте търговските си контакти с ИИ писане, гласови съобщения и аналитика',
    },
    toolIds: ['chatgpt', 'jasper', 'elevenlabs', 'tableau-ai'],
    icon: 'trending-up',
    accent: 'emerald',
    pricing: {
      monthly: { priceCents: 6500 },
      quarterly: { priceCents: 18900 },
      yearly: { priceCents: 72900 },
    },
    published: true,
  },
  'legal-research-stack': {
    slug: 'legal-research-stack',
    name: { en: 'Legal Research Stack', bg: 'Пакет за правни проучвания' },
    description: {
      en: 'Draft, summarise and analyse legal documents faster with AI writing and data tools',
      bg: 'Изготвяйте, обобщавайте и анализирайте правни документи по-бързо с ИИ инструменти за писане и данни',
    },
    toolIds: ['chatgpt', 'jasper', 'tableau-ai'],
    icon: 'scale',
    accent: 'slate',
    pricing: {
      monthly: { priceCents: 5900 },
      quarterly: { priceCents: 16900 },
      yearly: { priceCents: 64900 },
    },
    published: true,
  },
  'content-creator-suite': {
    slug: 'content-creator-suite',
    name: { en: 'Content Creator Suite', bg: 'Пакет за създатели на съдържание' },
    description: {
      en: 'Create stunning content across all formats: images, videos, text, and voiceovers',
      bg: 'Създавайте впечатляващо съдържание във всички формати - изображения, видео, текст и озвучаване',
    },
    toolIds: ['midjourney', 'runway', 'jasper', 'elevenlabs'],
    icon: 'sparkles',
    accent: 'pink',
    pricing: {
      monthly: { priceCents: 5400 },
      quarterly: { priceCents: 15200 },
      yearly: { priceCents: 58900 },
    },
    published: true,
  },
  'developer-productivity-kit': {
    slug: 'developer-productivity-kit',
    name: { en: 'Developer Productivity Kit', bg: 'Комплект за продуктивност на разработчици' },
    description: {
      en: 'Boost your coding efficiency with AI assistance, documentation, and data visualization',
      bg: 'Повишете ефективността си при програмиране с ИИ помощ, документация и визуализация на данни',
    },
    toolIds: ['github-copilot', 'chatgpt', 'tableau-ai'],
    icon: 'code',
    accent: 'cyan',
    pricing: {
      monthly: { priceCents: 3500 },
      quarterly: { priceCents: 9900 },
      yearly: { priceCents: 38900 },
    },
    published: true,
  },
};
