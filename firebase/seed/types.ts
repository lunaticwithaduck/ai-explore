import type { AppConfig, Bundle, Category, Review, Tool, ToolUpdate } from '@ai-explore/schemas';

export type SeedData = {
  categories: Record<string, Category>;
  tools: Record<string, Tool>;
  updates: Record<string, ToolUpdate[]>;
  reviews: Record<string, Review[]>;
  bundles: Record<string, Bundle>;
  appConfig: AppConfig;
};
