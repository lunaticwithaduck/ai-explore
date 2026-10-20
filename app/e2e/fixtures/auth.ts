import { expect, type Page, type TestInfo } from '@playwright/test';
import { E2E_ACCOUNTS } from '../../../firebase/seed/accounts';
import { routes } from '../../src/config/routes';
import { TEST_IDS } from '../../src/config/test-ids';

export type E2eUser = { displayName: string; email: string; password: string };
export type E2eAccount = { email: string; password: string };

export const uniqueUser = (testInfo: TestInfo, inv: string): E2eUser => ({
  displayName: `E2E ${inv} ${testInfo.project.name}`,
  email: `${inv}-${testInfo.project.name}-${Date.now()}@ai-explore.test`.toLowerCase(),
  password: 'e2e-pass-123456',
});

export const openMobileMenu = async (page: Page) => {
  const button = page.getByTestId(TEST_IDS.shell.mobileMenuButton);
  if (await button.isVisible()) await button.click();
};

export const signUp = async (page: Page, user: E2eUser) => {
  await page.goto(routes.signUp);
  await page.getByTestId(TEST_IDS.auth.displayName).fill(user.displayName);
  await page.getByTestId(TEST_IDS.auth.email).fill(user.email);
  await page.getByTestId(TEST_IDS.auth.password).fill(user.password);
  await page.getByTestId(TEST_IDS.auth.submit).click();
  await expect(page).not.toHaveURL(/\/sign-up/);
};

export const signIn = async (page: Page, account: E2eAccount) => {
  await page.goto(routes.signIn);
  await page.getByTestId(TEST_IDS.auth.email).fill(account.email);
  await page.getByTestId(TEST_IDS.auth.password).fill(account.password);
  await page.getByTestId(TEST_IDS.auth.submit).click();
  await expect(page).not.toHaveURL(/\/sign-in/);
};

export const signOut = async (page: Page) => {
  const menu = page.getByTestId(TEST_IDS.shell.userMenu);
  if (!(await menu.isVisible())) await openMobileMenu(page);
  await menu.click();
  await page.getByTestId(TEST_IDS.shell.signOut).click();
  await expect(page.getByTestId(TEST_IDS.shell.signIn).first()).toBeVisible();
};

export const adminAccount = E2E_ACCOUNTS.admin;
