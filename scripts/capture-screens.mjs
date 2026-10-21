import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const require = createRequire(join(root, 'app/package.json'));
const { chromium } = require('@playwright/test');

const base = `http://127.0.0.1:${process.env.APP_PORT ?? 3000}`;
const outDir = join(root, 'artifacts/screens');
const widths = [375, 1280];
const accounts = {
  member: { email: 'member@ai-explore.test', password: 'member-pass-123' },
  admin: { email: 'admin@ai-explore.test', password: 'admin-pass-123' },
};

const visitorPages = [
  ['library', '/'],
  ['library-bg', '/bg'],
  ['tool', '/tools/midjourney'],
  ['bundles', '/bundles'],
  ['bundle', '/bundles/startup-founder-pack'],
  ['compare', '/compare?a=midjourney&b=stable-diffusion'],
  ['sign-in', '/sign-in'],
  ['not-found', '/no-such-page'],
];
const memberPages = [
  ['my-library', '/library'],
  ['profile', '/profile'],
  ['settings', '/settings'],
];
const adminPages = [['admin', '/admin']];

async function signIn(page, account) {
  await page.goto(`${base}/sign-in`);
  await page.getByTestId('auth-email').fill(account.email);
  await page.getByTestId('auth-password').fill(account.password);
  await page.getByTestId('auth-submit').click();
  await page.waitForURL((url) => !url.pathname.includes('sign-in'));
}

async function shoot(page, name, path, width) {
  await page.goto(`${base}${path}`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(outDir, `final-${name}-${width}.png`), fullPage: true });
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const errors = [];
for (const width of widths) {
  for (const [who, pages] of [
    ['visitor', visitorPages],
    ['member', memberPages],
    ['admin', adminPages],
  ]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`${who} ${width}: ${error.message}`));
    if (who !== 'visitor') await signIn(page, accounts[who]);
    for (const [name, path] of pages) await shoot(page, name, path, width);
    if (who === 'member') {
      await page.goto(`${base}/`);
      await page.getByTestId('notifications-bell').click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: join(outDir, `final-notifications-${width}.png`) });
    }
    await context.close();
  }
}
await browser.close();
process.stdout.write(`page errors: ${errors.length}\n${errors.join('\n')}\n`);
process.exitCode = errors.length > 0 ? 1 : 0;
