import { toolSchema } from '@ai-explore/schemas';
import { describe, expect, it } from 'vitest';
import { defaultToolFormValues, type ToolFormValues, toolFormSchema } from '../config/toolForm';
import { buildToolDocument, buildToolPatch, toolToFormValues } from './toolDocument';

const filled = (): ToolFormValues => ({
  ...defaultToolFormValues(),
  slug: 'new-tool',
  name: 'New Tool',
  developer: 'Labs',
  websiteUrl: 'https://example.com',
  tagline: { en: 'Fast', bg: '' },
  description: { en: 'A tool', bg: 'Инструмент' },
  categoryId: 'image',
  logo: { path: '/logos/chatgpt.png', background: '#ffffff' },
  pricing: { hasFreePlan: true },
  published: true,
});

const now = new Date('2026-10-21T00:00:00.000Z');

describe('tool form', () => {
  it('accepts a filled form and rejects the defaults', () => {
    expect(toolFormSchema.safeParse(filled()).success).toBe(true);
    expect(toolFormSchema.safeParse(defaultToolFormValues()).success).toBe(false);
  });

  it('builds a complete document that passes toolSchema', () => {
    const doc = buildToolDocument(filled(), now);
    const result = toolSchema.safeParse(doc);
    expect(result.success).toBe(true);
    expect(doc.rating).toEqual({ count: 0, sum: 0 });
    expect(doc.comparison.bestUseCase).toEqual({ en: 'Fast' });
    expect(doc.pricing).toEqual({ hasFreePlan: true });
  });

  it('derives the from-price from the cheapest paid plan', () => {
    const values = filled();
    values.plans = [
      { name: 'Pro', priceCents: 2000, period: 'month', features: [] },
      { name: 'Yearly', priceCents: 12000, period: 'year', features: [], popular: true },
    ];
    values.pricing = { hasFreePlan: false, trialDays: 7 };
    const doc = buildToolDocument(values, now);
    expect(doc.pricing).toEqual({ hasFreePlan: false, trialDays: 7, fromPriceCents: 1000 });
    expect(toolSchema.safeParse(doc).success).toBe(true);
  });

  it('never writes rating or timestamps other than updatedAt on edit', () => {
    const patch = buildToolPatch(filled(), now);
    expect(patch).not.toHaveProperty('rating');
    expect(patch).not.toHaveProperty('createdAt');
    expect(patch).not.toHaveProperty('slug');
    expect(patch.updatedAt).toBe(now);
  });

  it('round-trips a tool through the form values', () => {
    const tool = toolSchema.parse(buildToolDocument(filled(), now));
    const values = toolToFormValues(tool);
    expect(toolFormSchema.safeParse(values).success).toBe(true);
    expect(values.description.bg).toBe('Инструмент');
    expect(values.tagline.bg).toBe('');
  });

  it('writes tutorials, comparison and related tools, and keeps rating out of patches', () => {
    const values = filled();
    values.tutorials = [
      {
        youtubeId: 'dQw4w9WgXcQ',
        title: { en: 'Intro', bg: '' },
        durationMin: 12,
        difficulty: 'advanced',
      },
    ];
    values.comparison = {
      apiAccess: 'full',
      integrations: 40,
      speed: 4,
      outputQuality: 5,
      bestUseCase: { en: 'Research', bg: 'Проучване' },
    };
    values.similarToolIds = ['a-tool'];
    values.complementaryToolIds = ['b-tool'];
    expect(toolFormSchema.safeParse(values).success).toBe(true);
    const doc = buildToolDocument(values, now);
    expect(toolSchema.safeParse(doc).success).toBe(true);
    expect(doc.tutorials[0]?.title).toEqual({ en: 'Intro' });
    expect(doc.comparison.bestUseCase).toEqual({ en: 'Research', bg: 'Проучване' });
    const patch = buildToolPatch(values, now);
    expect(patch).not.toHaveProperty('rating');
    expect(patch.similarToolIds).toEqual(['a-tool']);
    expect(patch.complementaryToolIds).toEqual(['b-tool']);
    expect(toolFormSchema.safeParse(toolToFormValues(toolSchema.parse(doc))).success).toBe(true);
  });

  it('rejects an invalid YouTube id and out-of-range speed', () => {
    const values = filled();
    values.tutorials = [
      { youtubeId: 'short', title: { en: 'x', bg: '' }, durationMin: 1, difficulty: 'beginner' },
    ];
    values.comparison.speed = 9;
    const result = toolFormSchema.safeParse(values);
    expect(result.success).toBe(false);
  });
});
