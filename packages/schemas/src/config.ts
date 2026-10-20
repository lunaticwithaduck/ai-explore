import { z } from 'zod';

export const appConfigSchema = z.object({
  checkoutEnabled: z.boolean(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;
