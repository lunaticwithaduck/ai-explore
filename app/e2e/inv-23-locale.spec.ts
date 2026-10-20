import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { routes } from '../src/config/routes';
import { TEST_IDS } from '../src/config/test-ids';
import { openMobileMenu, signIn, signOut, signUp, uniqueUser } from './fixtures/auth';

test('INV-23: the Bulgarian preference survives sign-out and sign-in', async ({
  page,
}, testInfo) => {
  // INV-23
  const bg = JSON.parse(
    readFileSync(join(testInfo.config.rootDir, '../src/messages/bg/common.json'), 'utf8'),
  ) as { tagline: string };
  const user = uniqueUser(testInfo, 'inv23');
  await signUp(page, user);
  await page.goto(routes.library);

  const switcher = page.getByTestId(TEST_IDS.shell.localeSwitcher);
  if (!(await switcher.isVisible())) await openMobileMenu(page);
  await switcher.click();
  await page.getByTestId(TEST_IDS.shell.localeOption).and(page.locator('[data-id="bg"]')).click();
  await expect(page).toHaveURL(/\/bg(\/|\?|$)/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
  await expect(page.getByText(bg.tagline)).toBeVisible();

  await signOut(page);
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await signIn(page, user);
  await expect(page).toHaveURL(/\/bg(\/|\?|$)/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg');
});
