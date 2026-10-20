import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { E2E_FIXTURES } from '../../firebase/seed/catalog-ids';
import { routes } from '../src/config/routes';
import { signUp, uniqueUser } from './fixtures/auth';

const blocking = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s)`);
};

test('INV-25: no serious or critical axe violations on the key pages', async ({
  page,
}, testInfo) => {
  // INV-25
  const [a, b] = E2E_FIXTURES.compareSlugs;
  const publicPages = [
    routes.library,
    routes.tool('midjourney'),
    routes.bundle(E2E_FIXTURES.bundleSlug),
    routes.compare(a, b),
  ];
  for (const path of publicPages) {
    await page.goto(path);
    await page.waitForLoadState('load');
    await expect(page.locator('main').first()).toBeVisible();
    expect(await blocking(page), path).toEqual([]);
  }

  await signUp(page, uniqueUser(testInfo, 'inv25'));
  await page.goto(routes.settings);
  await page.waitForLoadState('load');
  await expect(page.locator('main').first()).toBeVisible();
  expect(await blocking(page), routes.settings).toEqual([]);
});
