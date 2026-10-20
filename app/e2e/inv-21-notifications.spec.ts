import { expect, test } from '@playwright/test';
import { E2E_FIXTURES } from '../../firebase/seed/catalog-ids';
import { routes } from '../src/config/routes';
import { TEST_IDS } from '../src/config/test-ids';
import { signUp, uniqueUser } from './fixtures/auth';

test('INV-21: a seeded update for a saved tool shows as New and mark all read clears it', async ({
  page,
}, testInfo) => {
  // INV-21
  await signUp(page, uniqueUser(testInfo, 'inv21'));
  await page.goto(routes.tool(E2E_FIXTURES.notifyingToolSlug));
  const save = page.getByTestId(TEST_IDS.myLibrary.saveButton);
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');

  const badge = page.getByTestId(TEST_IDS.notifications.badge);
  await expect(badge).toBeVisible();
  await page.getByTestId(TEST_IDS.notifications.bell).click();
  const panel = page.getByTestId(TEST_IDS.notifications.panel);
  await expect(
    panel
      .getByTestId(TEST_IDS.notifications.item)
      .filter({ has: page.getByTestId(TEST_IDS.notifications.newLabel) }),
  ).not.toHaveCount(0);

  await page.getByTestId(TEST_IDS.notifications.markAllRead).click();
  await expect(badge).toHaveCount(0);

  await page.reload();
  await expect(page.getByTestId(TEST_IDS.notifications.bell)).toBeVisible();
  await expect(badge).toHaveCount(0);
});
