import { expect, test } from '@playwright/test';
import { routes } from '../src/config/routes';
import { TEST_IDS } from '../src/config/test-ids';

type Box = { x: number; y: number; width: number; height: number };

test('INV-26: library cards align in rows with equal heights, logos and price rows', async ({
  page,
}) => {
  // INV-26
  await page.goto(routes.library);
  const cards = page.getByTestId(TEST_IDS.library.toolCard);
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  expect(count).toBeGreaterThan(1);

  const box = async (locator: ReturnType<typeof cards.nth>): Promise<Box> => {
    const b = await locator.boundingBox();
    if (!b) throw new Error('missing bounding box');
    return b;
  };
  const items: { card: Box; logo: Box; price: Box }[] = [];
  for (let i = 0; i < count; i += 1) {
    const card = cards.nth(i);
    items.push({
      card: await box(card),
      logo: await box(card.getByTestId(TEST_IDS.library.cardLogo)),
      price: await box(card.getByTestId(TEST_IDS.library.cardPriceRow)),
    });
  }

  const first = items[0];
  if (!first) throw new Error('no cards');
  for (const item of items) {
    expect(Math.abs(item.logo.width - first.logo.width)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(item.logo.height - first.logo.height)).toBeLessThanOrEqual(0.5);
    const offset = item.card.y + item.card.height - (item.price.y + item.price.height);
    const firstOffset = first.card.y + first.card.height - (first.price.y + first.price.height);
    expect(Math.abs(offset - firstOffset)).toBeLessThanOrEqual(1);
  }

  const rows: (typeof items)[] = [];
  for (const item of items) {
    const row = rows.find((r) => Math.abs((r[0]?.card.y ?? Number.NaN) - item.card.y) <= 1);
    if (row) row.push(item);
    else rows.push([item]);
  }
  for (const row of rows) {
    const head = row[0];
    if (!head) continue;
    for (const item of row) {
      expect(Math.abs(item.card.height - head.card.height)).toBeLessThanOrEqual(1);
      expect(
        Math.abs(item.price.y + item.price.height - (head.price.y + head.price.height)),
      ).toBeLessThanOrEqual(1);
    }
  }
});
