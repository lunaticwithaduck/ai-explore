import type { SeedData } from '../types';
import { bundles } from './bundles';
import { categories } from './categories';
import { reviews } from './reviews';
import { chatGpt } from './tools/chatgpt';
import { elevenLabs } from './tools/elevenlabs';
import { githubCopilot } from './tools/github-copilot';
import { jasper } from './tools/jasper';
import { midJourney } from './tools/midjourney';
import { runway } from './tools/runway';
import { stableDiffusion } from './tools/stable-diffusion';
import { tableauAi } from './tools/tableau-ai';
import { updates } from './updates';

export const seedData: SeedData = {
  categories,
  tools: {
    midjourney: midJourney,
    chatgpt: chatGpt,
    runway: runway,
    'github-copilot': githubCopilot,
    elevenlabs: elevenLabs,
    'tableau-ai': tableauAi,
    'stable-diffusion': stableDiffusion,
    jasper: jasper,
  },
  updates,
  reviews,
  bundles,
  appConfig: { checkoutEnabled: false },
};
