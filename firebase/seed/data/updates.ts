import type { ToolUpdate } from '@ai-explore/schemas';
import { daysAgo } from './helpers';

export const updates: Record<string, ToolUpdate[]> = {
  midjourney: [
    {
      toolId: 'midjourney',
      version: '7.0',
      kind: 'feature',
      title: { en: 'Model 7 release', bg: 'Излиза моделът 7' },
      changes: [
        { en: 'Improved photorealism', bg: 'По-добър фотореализъм' },
        { en: 'Better text rendering', bg: 'По-добро изобразяване на текст' },
        { en: 'Faster generation times', bg: 'По-бързо генериране' },
      ],
      publishedAt: daysAgo(3),
    },
    {
      toolId: 'midjourney',
      version: '6.1',
      kind: 'improvement',
      title: { en: 'Coherence and speed', bg: 'Последователност и скорост' },
      changes: [
        { en: 'Reduced generation time by 30%', bg: '30% по-кратко време за генериране' },
        { en: 'Improved prompt understanding', bg: 'По-добро разбиране на промптовете' },
      ],
      publishedAt: daysAgo(40),
    },
  ],
  chatgpt: [
    {
      toolId: 'chatgpt',
      version: '4.1',
      kind: 'feature',
      title: { en: 'Longer context and vision', bg: 'По-дълъг контекст и визия' },
      changes: [
        { en: 'Larger context window', bg: 'По-голям контекстен прозорец' },
        { en: 'Improved vision capabilities', bg: 'Подобрени възможности за визия' },
        { en: 'JSON mode', bg: 'JSON режим' },
      ],
      publishedAt: daysAgo(12),
    },
    {
      toolId: 'chatgpt',
      version: '4.0.3',
      kind: 'bugfix',
      title: { en: 'Bug fixes', bg: 'Корекции на грешки' },
      changes: [
        { en: 'Fixed memory issues', bg: 'Поправени проблеми с паметта' },
        { en: 'Improved code generation', bg: 'Подобрено генериране на код' },
        { en: 'Better multilingual support', bg: 'По-добра многоезична поддръжка' },
      ],
      publishedAt: daysAgo(45),
    },
  ],
  runway: [
    {
      toolId: 'runway',
      version: '3.0',
      kind: 'feature',
      title: { en: 'Next-gen video model', bg: 'Видеомодел от ново поколение' },
      changes: [
        { en: 'Faster generation', bg: 'По-бързо генериране' },
        { en: 'Better motion consistency', bg: 'По-добра последователност на движението' },
        { en: 'Extended video length', bg: 'По-дълги видеа' },
      ],
      publishedAt: daysAgo(20),
    },
  ],
  'github-copilot': [
    {
      toolId: 'github-copilot',
      version: '1.85',
      kind: 'improvement',
      title: { en: 'Copilot Chat improvements', bg: 'Подобрения в Copilot Chat' },
      changes: [
        { en: 'Faster responses', bg: 'По-бързи отговори' },
        { en: 'Better code context', bg: 'По-добър контекст на кода' },
        { en: 'New slash commands', bg: 'Нови slash команди' },
      ],
      publishedAt: daysAgo(10),
    },
    {
      toolId: 'github-copilot',
      version: '1.84',
      kind: 'bugfix',
      title: { en: 'Stability fixes', bg: 'Корекции на стабилността' },
      changes: [{ en: 'Improved debugging', bg: 'Подобрено дебъгване' }],
      publishedAt: daysAgo(50),
    },
  ],
  elevenlabs: [
    {
      toolId: 'elevenlabs',
      version: '2.5',
      kind: 'feature',
      title: { en: 'Multilingual expansion', bg: 'Многоезично разширение' },
      changes: [
        { en: 'Added 5 new languages', bg: 'Добавени 5 нови езика' },
        { en: 'Improved accent accuracy', bg: 'По-точни акценти' },
        { en: 'Faster voice cloning', bg: 'По-бързо клониране на глас' },
      ],
      publishedAt: daysAgo(25),
    },
    {
      toolId: 'elevenlabs',
      version: '2.4',
      kind: 'improvement',
      title: { en: 'Voice quality improvements', bg: 'Подобрения в качеството на гласа' },
      changes: [{ en: 'More natural intonation', bg: 'По-естествена интонация' }],
      publishedAt: daysAgo(70),
    },
  ],
  'tableau-ai': [
    {
      toolId: 'tableau-ai',
      version: '2025.3',
      kind: 'feature',
      title: { en: 'AI-powered insights', bg: 'Прозрения с помощта на ИИ' },
      changes: [
        { en: 'Automated insights', bg: 'Автоматизирани прозрения' },
        { en: 'Natural language queries', bg: 'Заявки на естествен език' },
        { en: 'Smart recommendations', bg: 'Интелигентни препоръки' },
      ],
      publishedAt: daysAgo(18),
    },
    {
      toolId: 'tableau-ai',
      version: '2025.2',
      kind: 'improvement',
      title: { en: 'Dashboard performance', bg: 'Производителност на таблата' },
      changes: [{ en: 'Faster dashboard loading', bg: 'По-бързо зареждане на таблата' }],
      publishedAt: daysAgo(80),
    },
  ],
  'stable-diffusion': [
    {
      toolId: 'stable-diffusion',
      version: '3.5',
      kind: 'feature',
      title: { en: 'Stable Diffusion 3.5 release', bg: 'Излиза Stable Diffusion 3.5' },
      changes: [
        { en: 'Higher resolution output', bg: 'Изображения с по-висока резолюция' },
        { en: 'Better composition', bg: 'По-добра композиция' },
        { en: 'Improved face generation', bg: 'По-добро генериране на лица' },
      ],
      publishedAt: daysAgo(30),
    },
    {
      toolId: 'stable-diffusion',
      version: '3.0',
      kind: 'feature',
      title: { en: 'Stable Diffusion 3 release', bg: 'Излиза Stable Diffusion 3' },
      changes: [
        {
          en: 'New diffusion transformer architecture',
          bg: 'Нова архитектура с дифузионен трансформър',
        },
      ],
      publishedAt: daysAgo(90),
    },
  ],
  jasper: [
    {
      toolId: 'jasper',
      version: '3.0',
      kind: 'feature',
      title: { en: 'Brand voice update', bg: 'Обновление на гласа на марката' },
      changes: [
        { en: 'Custom brand voice training', bg: 'Обучение на персонализиран глас на марката' },
        { en: 'SEO optimizer', bg: 'SEO оптимизатор' },
        { en: 'Performance dashboard', bg: 'Табло за ефективност' },
      ],
      publishedAt: daysAgo(15),
    },
    {
      toolId: 'jasper',
      version: '2.9',
      kind: 'improvement',
      title: { en: 'Team collaboration', bg: 'Съвместна работа в екип' },
      changes: [{ en: 'Shared workspaces', bg: 'Споделени работни пространства' }],
      publishedAt: daysAgo(60),
    },
  ],
};
