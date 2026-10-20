import { expect, test } from '@playwright/test';
import { E2E_FIXTURES } from '../../firebase/seed/catalog-ids';
import { routes } from '../src/config/routes';
import { TEST_IDS } from '../src/config/test-ids';

test.fixme('INV-19: visitor searches, filters, opens a tool, compares and copies the share link', async ({
  page,
  context,
}) => {
  // INV-19
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const card = (slug: string) =>
    page.getByTestId(TEST_IDS.library.toolCard).and(page.locator(`[data-id="${slug}"]`));

  await page.goto(routes.library);
  const search = page.getByTestId(TEST_IDS.library.searchInput);
  await search.fill(E2E_FIXTURES.searchTerm);
  await expect(card('midjourney')).toBeVisible();
  await expect(card('stable-diffusion')).toHaveCount(0);
  await search.fill('');
  await expect(card('stable-diffusion')).toBeVisible();

  await page
    .getByTestId(TEST_IDS.library.categoryFilter)
    .locator(`[data-id="${E2E_FIXTURES.searchCategoryId}"]`)
    .click();
  await expect(card('midjourney')).toBeVisible();
  await expect(card('stable-diffusion')).toBeVisible();
  await expect(card('chatgpt')).toHaveCount(0);

  await card('midjourney').click();
  await expect(page).toHaveURL(new RegExp(`${routes.tool('midjourney')}$`));

  const tutorials = page.getByTestId(TEST_IDS.tool.tutorials);
  const items = tutorials.getByTestId(TEST_IDS.tool.tutorialItem);
  await expect.poll(() => items.count()).toBeGreaterThanOrEqual(4);
  const last = items.last();
  const next = tutorials.getByTestId(TEST_IDS.carousel.next);
  await next.click();
  for (
    let i = 0;
    i < 12 &&
    !(
      (await last.isVisible()) &&
      (await last.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.right <= window.innerWidth && r.left >= 0;
      }))
    );
    i += 1
  ) {
    if (await next.isDisabled()) break;
    await next.click();
  }
  await expect(last).toBeInViewport();

  await page.getByTestId(TEST_IDS.compare.link).click();
  await expect(page).toHaveURL(/\/compare/);
  const columns = page.getByTestId(TEST_IDS.compare.table).getByTestId(TEST_IDS.compare.column);
  await expect(columns).toHaveCount(2);
  await expect(columns.and(page.locator('[data-id="midjourney"]'))).toHaveCount(1);

  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`${routes.tool('midjourney')}$`));
  await page.getByTestId(TEST_IDS.share.button).click();
  await page.getByTestId(TEST_IDS.share.copyLink).click();
  await expect(page.getByTestId(TEST_IDS.share.copied)).toBeVisible();
});
