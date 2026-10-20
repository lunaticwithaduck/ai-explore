import {
  appConfigSchema,
  bundleSchema,
  categorySchema,
  cheapestPaidPlanCents,
  NOTIFICATION_WINDOW_DAYS,
  toolSchema,
  toolUpdateSchema,
} from '@ai-explore/schemas';
import { describe, expect, it } from 'vitest';
import { E2E_ACCOUNTS } from './accounts';
import { SEED_BUNDLE_SLUGS, SEED_CATEGORY_IDS, SEED_TOOL_SLUGS } from './catalog-ids';
import { seedData } from './data';

const builtAt = Date.now();
const DAY_MS = 86_400_000;
const MIN_TUTORIALS = 4;
const sorted = (ids: Iterable<string>) => [...ids].sort();

describe('INV-14: seed integrity', () => {
  const { categories, tools, updates, bundles, appConfig } = seedData;
  const toolIds = new Set(Object.keys(tools));
  const categoryIds = new Set(Object.keys(categories));

  it('parses every category, tool, update, bundle and the app config with its schema', () => {
    for (const [id, category] of Object.entries(categories))
      expect(categorySchema.safeParse(category).error, id).toBeUndefined();
    for (const [slug, tool] of Object.entries(tools))
      expect(toolSchema.safeParse(tool).error, slug).toBeUndefined();
    for (const [slug, list] of Object.entries(updates))
      for (const update of list)
        expect(toolUpdateSchema.safeParse(update).error, slug).toBeUndefined();
    for (const [slug, bundle] of Object.entries(bundles))
      expect(bundleSchema.safeParse(bundle).error, slug).toBeUndefined();
    expect(appConfigSchema.safeParse(appConfig).error).toBeUndefined();
  });

  it('keys every tool and bundle by its slug and every update list by its toolId', () => {
    for (const [key, tool] of Object.entries(tools)) expect(tool.slug).toBe(key);
    for (const [key, bundle] of Object.entries(bundles)) expect(bundle.slug).toBe(key);
    for (const [key, list] of Object.entries(updates))
      for (const update of list) expect(update.toolId).toBe(key);
  });

  it('has exactly the catalogue ids that the contracts list', () => {
    expect(sorted(toolIds)).toEqual(sorted(SEED_TOOL_SLUGS));
    expect(sorted(Object.keys(bundles))).toEqual(sorted(SEED_BUNDLE_SLUGS));
    expect(sorted(categoryIds)).toEqual(sorted(SEED_CATEGORY_IDS));
  });

  it('resolves every tool, bundle and update reference', () => {
    for (const tool of Object.values(tools)) {
      expect(categoryIds, `${tool.slug}.categoryId`).toContain(tool.categoryId);
      for (const id of [...tool.similarToolIds, ...tool.complementaryToolIds])
        expect(toolIds, `${tool.slug} → ${id}`).toContain(id);
    }
    for (const bundle of Object.values(bundles))
      for (const id of bundle.toolIds) expect(toolIds, `${bundle.slug} → ${id}`).toContain(id);
    for (const [key, list] of Object.entries(updates)) {
      expect(toolIds, `updates.${key}`).toContain(key);
      for (const update of list) expect(toolIds).toContain(update.toolId);
    }
  });

  it('sets every fromPriceCents to the cheapest paid plan, monthly-normalised', () => {
    for (const tool of Object.values(tools))
      expect(tool.pricing.fromPriceCents, tool.slug).toBe(cheapestPaidPlanCents(tool.plans));
  });

  it('gives every tool at least 4 tutorials with unique youtubeIds', () => {
    for (const tool of Object.values(tools)) {
      const ids = tool.tutorials.map((tutorial) => tutorial.youtubeId);
      expect(ids.length, tool.slug).toBeGreaterThanOrEqual(MIN_TUTORIALS);
      expect(new Set(ids).size, tool.slug).toBe(ids.length);
    }
  });

  it('gives every tool a Bulgarian tagline and description', () => {
    for (const tool of Object.values(tools)) {
      expect(tool.tagline.bg?.trim(), `${tool.slug}.tagline.bg`).toBeTruthy();
      expect(tool.description.bg?.trim(), `${tool.slug}.description.bg`).toBeTruthy();
    }
  });

  it('ships with checkout disabled', () => {
    expect(appConfig.checkoutEnabled).toBe(false);
  });

  it('has a recent update for the member’s first saved tool', () => {
    const savedToolId = E2E_ACCOUNTS.member.savedToolIds[0];
    const windowStart = builtAt - NOTIFICATION_WINDOW_DAYS * DAY_MS;
    const recent = (updates[savedToolId] ?? []).filter((update) => {
      const publishedAt = update.publishedAt.getTime();
      return publishedAt > windowStart && publishedAt <= builtAt;
    });
    expect(recent.length).toBeGreaterThan(0);
  });
});
