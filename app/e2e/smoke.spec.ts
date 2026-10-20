import { expect, test } from '@playwright/test';

test('library renders in English at the root', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1, name: 'AI Explore' })).toBeVisible();
});

test('library renders in Bulgarian under /bg', async ({ page }) => {
  await page.goto('/bg');
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
  await expect(page.getByText('Вашата библиотека с AI инструменти')).toBeVisible();
});
