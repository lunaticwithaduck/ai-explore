import { expect, test } from '@playwright/test';
import { E2E_FIXTURES } from '../../firebase/seed/catalog-ids';
import { routes } from '../src/config/routes';
import { TEST_IDS } from '../src/config/test-ids';
import { openMobileMenu, signUp, uniqueUser } from './fixtures/auth';
import { resetUnreviewedTool } from './fixtures/reset';

test.beforeEach(async () => {
  await resetUnreviewedTool(E2E_FIXTURES.unreviewedToolSlug);
});

test('INV-20: user saves, collects, reviews, edits and deletes a review', async ({
  page,
}, testInfo) => {
  // INV-20
  const slug = E2E_FIXTURES.unreviewedToolSlug;
  const collectionName = `Col ${Date.now()}`;
  await signUp(page, uniqueUser(testInfo, 'inv20'));

  await page.goto(routes.tool(slug));
  const save = page.getByTestId(TEST_IDS.myLibrary.saveButton);
  await expect(save).toHaveAttribute('aria-pressed', 'false');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId(TEST_IDS.myLibrary.addToCollection).click();
  await page.getByTestId(TEST_IDS.myLibrary.newCollection).click();
  await page.getByTestId(TEST_IDS.myLibrary.collectionNameInput).fill(collectionName);
  await page.getByTestId(TEST_IDS.myLibrary.collectionCreate).click();

  await openMobileMenu(page);
  const sidebarCollection = page
    .getByTestId(TEST_IDS.shell.sidebarCollection)
    .filter({ hasText: collectionName });
  await expect(sidebarCollection).toBeVisible();
  const collectionId = await sidebarCollection.getAttribute('data-id');
  expect(collectionId).toBeTruthy();
  await sidebarCollection.click();
  await expect(page).toHaveURL(new RegExp(`/library\\?collection=${collectionId}`));
  await expect(
    page
      .getByTestId(TEST_IDS.myLibrary.grid)
      .getByTestId(TEST_IDS.library.toolCard)
      .and(page.locator(`[data-id="${slug}"]`)),
  ).toBeVisible();

  await page.goto(routes.tool(slug));
  const form = page.getByTestId(TEST_IDS.reviews.form);
  await form.getByTestId(TEST_IDS.reviews.ratingInput).locator('[data-id="4"]').click();
  await form.getByTestId(TEST_IDS.reviews.bodyInput).fill('Solid tool for the price.');
  await form.getByTestId(TEST_IDS.reviews.submit).click();
  await expect(page.getByTestId(TEST_IDS.tool.ratingAverage)).toContainText('4.0');
  await expect(page.getByTestId(TEST_IDS.tool.ratingCount)).toContainText('1');

  await page.goto(routes.library);
  await expect(
    page
      .getByTestId(TEST_IDS.library.toolCard)
      .and(page.locator(`[data-id="${slug}"]`))
      .getByTestId(TEST_IDS.library.cardRating),
  ).toContainText('4.0');

  await page.goto(routes.tool(slug));
  await page.getByTestId(TEST_IDS.reviews.edit).click();
  await page
    .getByTestId(TEST_IDS.reviews.form)
    .getByTestId(TEST_IDS.reviews.ratingInput)
    .locator('[data-id="2"]')
    .click();
  await page.getByTestId(TEST_IDS.reviews.form).getByTestId(TEST_IDS.reviews.submit).click();
  await expect(page.getByTestId(TEST_IDS.tool.ratingAverage)).toContainText('2.0');

  await page.getByTestId(TEST_IDS.reviews.delete).click();
  await page.getByTestId(TEST_IDS.reviews.confirmDelete).click();
  await expect(page.getByTestId(TEST_IDS.tool.ratingAverage)).toBeHidden();
});
