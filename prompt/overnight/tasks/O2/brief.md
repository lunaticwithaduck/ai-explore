**Template:** brief-v1 · **Task:** O2 · **Phase:** 2 · **Model:** sonnet · **Base sha:** 0865ad6

# O2 — The oracle: end-to-end invariants INV-19 to INV-26

You write **Playwright specs and fixtures only**. They are the acceptance oracle that other lanes
(B1, T1, T2, A1, U1, V1, N1, M1, H1, E4, E5) must later satisfy. The UI does not exist yet; every
route renders a stub. So every INV spec ships as `test.fixme('INV-<n>: …', async (…) => { …full body… })`.
The fixme marker is the only thing implementers may remove.

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md` §Tests (binding).
2. `~/Repos/ai-explore/prompt/SPEC.md` §3–§10 and §Invariants 19–26 (each spec encodes one invariant exactly).
3. The selector contract `app/src/config/test-ids.ts` and the route helpers `app/src/config/routes.ts`.
   **Select only through `TEST_IDS`, roles, and `routes`.** Never select by CSS class or copy, except
   the copy rules below.
4. Fixture contracts: `firebase/seed/accounts.ts` (`E2E_ACCOUNTS`) and `firebase/seed/catalog-ids.ts`
   (`E2E_FIXTURES`, the slug lists). Import them relatively from the spec files.
5. Harness: `app/playwright.config.ts` (projects `mobile` 375 and `desktop` 1280, workers 1, `next start`
   on `APP_PORT`), `app/e2e/smoke.spec.ts` (exemplar), `scripts/test-e2e.sh` (build → emulators → seed → playwright).

## Where you work
- Worktree `~/Repos/ai-explore-wt/O2`, branch `overnight/O2`, `SLOT=2`.
- Scope: `app/e2e/**`, `app/playwright.config.ts`. Hand-back to `~/Repos/ai-explore/prompt/overnight/tasks/O2/handback.md`.

## Conventions the implementers will follow (encode them, don't invent others)
- Repeated items carry `data-id`: a tool card has `data-id=<slug>`, a period option `data-id=monthly|quarterly|yearly`,
  a locale option `data-id=en|bg`, a sidebar collection `data-id=<collectionId>`, a category filter
  option `data-id=<categoryId>`, a tutorial item `data-id=<youtubeId>`, a compare column `data-id=<slug>`,
  a review rating input option `data-id=1..5`.
- Toggles expose state through ARIA: the save button has `aria-pressed`, and the period options are `role=radio` with `aria-checked`.
- `/admin` for a non-admin renders `TEST_IDS.admin.forbidden`.
- The Bulgarian chrome is asserted through `html[lang=bg]` plus the `common.tagline` string, read from
  `app/src/messages/bg/common.json`. The library hero always renders `common.appName` (h1) and `common.tagline`.
- Admin tool form fields use `adminToolField(name)` for these required fields: `slug`, `name`, `developer`,
  `websiteUrl`, `tagline.en`, `description.en`, `categoryId` (a native select or a combobox), `logo.path`,
  `logo.background`, `pricing.hasFreePlan` (checkbox). There is also `TEST_IDS.admin.publishToggle` and `saveTool`. Every
  other field has a default.

## State and isolation rules
- Both projects run every spec sequentially in one emulator session, so **specs must be re-runnable**:
  - Create fresh users per test with unique emails (`<inv>-<project>-<Date.now()>@ai-explore.test`)
    through the sign-up UI.
  - Use unique slugs for the admin-created tool.
  - Leave shared state as you found it. INV-20 deletes its review. It runs on
    `E2E_FIXTURES.unreviewedToolSlug`, which the seed guarantees has 0 reviews and `rating {0,0}`.
- **Fixture helpers** (`app/e2e/fixtures/*.ts`):
  - `signUp(page, user)` and `signIn(page, account)` through `TEST_IDS.auth.*` on `routes.signUp` / `routes.signIn`;
  - `signOut(page)` through `TEST_IDS.shell.userMenu` → `signOut` (on mobile, open `mobileMenuButton` first if the menu is hidden);
  - `uniqueUser(testInfo, inv)`;
  - an optional `emulatorRest` helper for setup or assertions that must bypass rules: `fetch`
    `http://127.0.0.1:${process.env.FIRESTORE_PORT}/v1/projects/demo-ai-explore/databases/(default)/documents/...`
    with header `Authorization: Bearer owner`.

## The eight specs (one file each: `app/e2e/inv-19-visitor.spec.ts` … `inv-26-card-layout.spec.ts`)
- **INV-19 visitor:**
  1. On the library, type `E2E_FIXTURES.searchTerm` into `library.searchInput`. The midjourney card is
     visible and the stable-diffusion card is not. Clear the search.
  2. Click the category filter `data-id=image`. Only image tools remain (both image slugs visible, chatgpt hidden).
  3. Open the midjourney card. You are on `routes.tool('midjourney')`.
  4. `tool.tutorials` contains at least 4 `tool.tutorialItem`. Click `carousel.next` inside it; a later
     item becomes visible in the viewport.
  5. Click `compare.link`. You are on `/compare`, and `compare.table` has 2 `compare.column` (midjourney plus another).
  6. Go back and click `share.button`, then `share.copyLink`. `share.copied` is visible. Grant clipboard
     permissions in the context; the fallback must also work.
- **INV-20 user:**
  1. Sign up.
  2. On `routes.tool(unreviewed)`, click `myLibrary.saveButton`; it goes from `aria-pressed=false` to `true`.
  3. Open `myLibrary.addToCollection`, then `myLibrary.newCollection`, fill `collectionNameInput`, and
     click `collectionCreate`. The tool is added.
  4. The `shell.sidebarCollection` with that name appears; on mobile, open the menu first. Click it.
     You are on `/library?collection=<id>`, and `myLibrary.grid` contains the tool card.
  5. Back on the tool, fill `reviews.form` with rating `data-id=4` and a body, then submit.
     `tool.ratingAverage` shows `4.0` and `tool.ratingCount` contains `1`, and the library card's
     `library.cardRating` for that slug shows `4.0`.
  6. Edit the review to 2. The average is `2.0`.
  7. Delete it with `reviews.delete` then `confirmDelete`. The rating area no longer shows an average.
- **INV-21 notifications:**
  1. Sign up and save `E2E_FIXTURES.notifyingToolSlug`.
  2. `notifications.badge` is visible. Open the bell; `notifications.panel` has at least one
     `notifications.item` containing `notifications.newLabel`.
  3. Click `markAllRead`. The badge is gone.
  4. Reload. The badge is still gone.
- **INV-22 bundle:**
  1. Open `routes.bundle(E2E_FIXTURES.bundleSlug)`.
  2. Switch through each `bundles.periodOption`. `bundles.price`, `listPrice` and `savings` text change
     between periods, and savings matches `/\d+%/`.
  3. `bundles.subscribe` has count 0.
  4. Signed in as a fresh user, click `bundleInterest.notifyMe`. `bundleInterest.registered` is visible.
  5. Reload. `registered` is still visible and `notifyMe` is absent or disabled.
- **INV-23 locale:**
  1. Sign up.
  2. Use `shell.localeSwitcher` → `localeOption data-id=bg`. The URL path starts with `/bg`, the html
     lang is `bg`, and the BG tagline is visible on the library.
  3. Sign out, then go to `/` (EN).
  4. Sign in again. The app ends on a `/bg` URL with `lang=bg`.
- **INV-24 admin:**
  1. Sign in as `E2E_ACCOUNTS.admin` and go to `routes.adminNewTool`. Fill the required fields with a
     unique slug, toggle publish on, and save.
  2. The library shows a card with `data-id=<slug>`.
  3. Then, as a fresh non-admin user, `routes.admin` shows `admin.forbidden`.
- **INV-25 accessibility:** using `@axe-core/playwright`, there are no `serious` or `critical`
  violations on the library, `routes.tool('midjourney')`, `routes.bundle(bundleSlug)`,
  `routes.compare(...E2E_FIXTURES.compareSlugs)`, and `routes.settings` (signed in as a fresh user).
- **INV-26 card layout:**
  - On the library, collect the bounding boxes of every `library.toolCard`, its `library.cardLogo` and
    its `library.cardPriceRow`.
  - For cards sharing a row (same `y` ±1), heights are equal (±1).
  - All logo boxes have identical width and height (±0.5).
  - Within each row, the price-row bottom edges are equal (±1), and every card's
    `card.bottom − priceRow.bottom` is equal (±1) across all cards.

## Acceptance
- [ ] Eight spec files, each with `test.fixme('INV-<n>: …')` and real steps and assertions, no placeholders.
- [ ] Fixtures typecheck: `pnpm --filter @ai-explore/app typecheck` → exit 0. Specs list: `cd app && pnpm exec playwright test --list` → exit 0 and shows the INV titles.
- [ ] `scripts/gate.sh --full --task O2 --base 0865ad6` → `GATE PASS`, with pending equal to {19–26} (O1's skips are not on your branch).

## Out of scope
Any app code, `test-ids.ts` or `routes.ts`. If a spec needs a selector the contract lacks, use the
closest role-based selector and list the gap in your hand-back. Do not edit the contract.

## Stop conditions (do not guess)
A flow in SPEC cannot be expressed with the contract above. Write the spec as far as possible and flag the gap.

## Boundaries
No push, no deploy, no new dependencies, no comments except `// INV-n`. Use named `git add` only.
Commit as `test(e2e): oracle specs and fixtures for INV-19–26 [O2]` with a why-body and
`Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Hand-back
Fill `~/Repos/ai-explore/prompt/overnight/templates/handback.md` into `~/Repos/ai-explore/prompt/overnight/tasks/O2/handback.md`.
