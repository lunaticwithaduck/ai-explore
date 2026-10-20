import { expect, test } from '@playwright/test';
import { E2E_FIXTURES } from '../../firebase/seed/catalog-ids';
import { routes } from '../src/config/routes';
import { TEST_IDS } from '../src/config/test-ids';
import { signUp, uniqueUser } from './fixtures/auth';

test.fixme('INV-22: bundle periods change prices, subscribe is absent, notify me registers once', async ({
  page,
}, testInfo) => {
  // INV-22
  await page.goto(routes.bundle(E2E_FIXTURES.bundleSlug));
  const seen: string[] = [];
  for (const period of ['monthly', 'quarterly', 'yearly']) {
    const option = page
      .getByTestId(TEST_IDS.bundles.periodOption)
      .and(page.locator(`[data-id="${period}"]`));
    await option.click();
    await expect(option).toHaveAttribute('aria-checked', 'true');
    const price = (await page.getByTestId(TEST_IDS.bundles.price).innerText()).trim();
    const listPrice = (await page.getByTestId(TEST_IDS.bundles.listPrice).innerText()).trim();
    const savings = (await page.getByTestId(TEST_IDS.bundles.savings).innerText()).trim();
    expect(savings).toMatch(/\d+%/);
    seen.push(`${price}|${listPrice}|${savings}`);
  }
  expect(new Set(seen).size).toBe(3);
  await expect(page.getByTestId(TEST_IDS.bundles.subscribe)).toHaveCount(0);

  await signUp(page, uniqueUser(testInfo, 'inv22'));
  await page.goto(routes.bundle(E2E_FIXTURES.bundleSlug));
  await page.getByTestId(TEST_IDS.bundleInterest.notifyMe).click();
  await expect(page.getByTestId(TEST_IDS.bundleInterest.registered)).toBeVisible();

  await page.reload();
  await expect(page.getByTestId(TEST_IDS.bundleInterest.registered)).toBeVisible();
  const notifyMe = page.getByTestId(TEST_IDS.bundleInterest.notifyMe);
  if ((await notifyMe.count()) > 0) await expect(notifyMe).toBeDisabled();
});
