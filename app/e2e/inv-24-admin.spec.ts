import { expect, test } from '@playwright/test';
import { E2E_ACCOUNTS } from '../../firebase/seed/accounts';
import { E2E_FIXTURES } from '../../firebase/seed/catalog-ids';
import { routes } from '../src/config/routes';
import { adminToolField, TEST_IDS } from '../src/config/test-ids';
import { signIn, signOut, signUp, uniqueUser } from './fixtures/auth';
import { emulatorRest } from './fixtures/emulator-rest';

test.fixme('INV-24: an admin publishes a tool and a non-admin sees the 403 view', async ({
  page,
}, testInfo) => {
  // INV-24
  const slug = `e2e-tool-${testInfo.project.name}-${Date.now()}`;
  const field = (name: string) => page.getByTestId(adminToolField(name));
  try {
    await signIn(page, E2E_ACCOUNTS.admin);
    await page.goto(routes.adminNewTool);
    await field('slug').fill(slug);
    await field('name').fill(`E2E Tool ${slug}`);
    await field('developer').fill('E2E Labs');
    await field('websiteUrl').fill('https://example.com');
    await field('tagline.en').fill('Created by the admin spec');
    await field('description.en').fill('A tool created end to end by the admin spec.');
    const category = field('categoryId');
    if ((await category.evaluate((el) => el.tagName)) === 'SELECT') {
      await category.selectOption(E2E_FIXTURES.searchCategoryId);
    } else {
      await category.click();
      await page.getByRole('option').first().click();
    }
    await field('logo.path').fill('/logos/chatgpt.png');
    await field('logo.background').fill('#ffffff');
    await field('pricing.hasFreePlan').setChecked(true);
    await page.getByTestId(TEST_IDS.admin.publishToggle).setChecked(true);
    await page.getByTestId(TEST_IDS.admin.saveTool).click();
    await expect(page.getByTestId(TEST_IDS.admin.saved)).toBeVisible();

    await page.goto(routes.library);
    await expect(
      page.getByTestId(TEST_IDS.library.toolCard).and(page.locator(`[data-id="${slug}"]`)),
    ).toBeVisible();

    await signOut(page);
    await signUp(page, uniqueUser(testInfo, 'inv24'));
    await page.goto(routes.admin);
    await expect(page.getByTestId(TEST_IDS.admin.forbidden)).toBeVisible();
  } finally {
    await emulatorRest(`tools/${slug}`, { method: 'DELETE' }).catch(() => undefined);
  }
});
