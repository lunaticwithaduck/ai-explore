import type { AppConfig, Bundle, Category, Tool, ToolUpdate } from '@ai-explore/schemas';

export type SeedData = {
  categories: Record<string, Category>;
  tools: Record<string, Tool>;
  updates: Record<string, ToolUpdate[]>;
  bundles: Record<string, Bundle>;
  appConfig: AppConfig;
};
