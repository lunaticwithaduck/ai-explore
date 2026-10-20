**Template:** brief-v1 · **Task:** S1 · **Phase:** 3 · **Model:** sonnet · **Base sha:** 376cd00

# S1 — Seed catalogue, seed script, and logos

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md` (binding).
2. `~/Repos/ai-explore/prompt/SPEC.md` §2, §9 (rulings 2–3 on logos), §10 (bundle pricing) and INV-14.
3. Contracts:
   - `packages/schemas/src/*.ts`: every document must parse with its schema;
   - `firebase/seed/types.ts` (`SeedData`), `catalog-ids.ts` (the exact slug lists and `E2E_FIXTURES`),
     `accounts.ts` (`E2E_ACCOUNTS`), `data/index.ts` (the stub you replace).
4. Source data: the owner's prototype, read-only. `reference/figma-make/src/app/data/aiTools.ts` has
   the 8 tools, plans, tutorials, updates, comparison data, similar/complementary tools, reviews and
   bundles. Logos are in `reference/figma-make/src/imports/`:

   | file | tool |
   |---|---|
   | `image.png` | ChatGPT |
   | `image-1.png` | Midjourney |
   | `image-2.png` | ElevenLabs |
   | `image-3.png` | Runway |
   | `image-6.png` | Tableau |
   | `image-7.png` | Jasper |
   | `image-8.png` | Stable Diffusion |
   | `image-9.png` | GitHub Copilot |

   A white ChatGPT logo (512 px, transparent background) is ready at `~/Repos/ai-explore-wt/S1-assets/chatgpt-white.png`.

## Where you work
- Worktree `~/Repos/ai-explore-wt/S1`, branch `overnight/S1`, `SLOT=4`.
- Scope: `firebase/seed/**`, `app/public/logos/**`.
- The hand-back goes to `~/Repos/ai-explore/prompt/overnight/tasks/S1/handback.md`.

## Goal

### 1. `firebase/seed/data/**`

Replace the stub with real `seedData: SeedData`, split into readable files: `categories.ts`,
`tools/<slug>.ts` (one per tool), `updates.ts`, `reviews.ts`, `bundles.ts` and `index.ts`.
`firebase/seed/data/**` is exempt from the 200-line rule.

**Categories**
- Exactly `SEED_CATEGORY_IDS`.
- Each has EN and BG names, a lucide icon name and an order.

**Tools**
- Exactly `SEED_TOOL_SLUGS`. Port each from the prototype into the schema.
- Money is integer cents. Set `pricing.fromPriceCents = cheapestPaidPlanCents(plans)` from
  `@ai-explore/schemas`; the prototype's headline prices were inconsistent, so its plans win.
- Every `Localized` field gets a natural Bulgarian `bg`: tagline, description, features, plan features,
  tutorial titles and bestUseCase.
- `logo.path` is `/logos/<slug>.png`.
- `logo.background` follows the owner's explicit requests from the prototype session:

  | Tool | Background |
  |---|---|
  | Tableau | white or off-white |
  | Jasper | orange |
  | Runway | white |
  | MidJourney | light blue/green |
  | ChatGPT | dark grey-black, with the **white** logo |
  | everything else | a background that contrasts with the logo's original colours |

- `similarToolIds` / `complementaryToolIds` come from the prototype and must resolve.
- `rating` must equal the seeded reviews exactly. **`jasper` has zero reviews and `rating {count: 0, sum: 0}`.**
- `published: true`. Timestamps are `Date`s.

**Tutorials**
- At least 4 per tool, **real YouTube videos only**. For each tool:
  - Find candidates with WebSearch, e.g. "<tool> tutorial for beginners youtube".
  - Verify every id with `curl -s -o /dev/null -w '%{http_code}' 'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json'`.
    It must return 200. Use the oEmbed JSON `title` (`curl -s` the same URL) as `title.en`, and translate it for `bg`.
- `durationMin`: take it from the search result or the watch page if visible. Otherwise estimate, and
  list the estimated ones in the README.
- Keep the prototype's video ids only if they verify.

**Updates**
- 2–4 per tool: version numbers without a "v", a kind, and EN+BG titles and changes.
- `publishedAt` is relative to construction time (a `daysAgo(n)` helper).
- `E2E_FIXTURES.notifyingToolSlug` (midjourney) must have at least one update within the last 7 days.

**Reviews**
- Sample reviews with fake `authorUid`s (`seed-reviewer-1`…). The doc id equals `authorUid`, and
  `toolId` equals the key.
- Spread 1–3 per tool over every tool except jasper, with `helpfulCount` ≥ 0.

**Bundles**
- Exactly `SEED_BUNDLE_SLUGS`. Port the prototype's bundles and add `legal-research-stack` (choose the
  most fitting existing tools; at least 2).
- EN+BG names and descriptions, an accent from `ACCENTS`, and a lucide icon.
- Prices in cents for monthly, quarterly and yearly, each below the `pricing.ts` list price for that period
  (positive savings), and `published: true`.

**`appConfig`:** `{ checkoutEnabled: false }`.

### 2. `firebase/seed/seed.ts`

Use `firebase-admin` against the emulators only. Refuse to run unless `FIRESTORE_EMULATOR_HOST` is
set and the project is `demo-ai-explore`. It is idempotent, so it can run on every e2e run and
re-running it changes nothing. It writes:
- every category, tool, `tools/<slug>/updates/<id>`, `tools/<slug>/reviews/<uid>`, bundle, and `config/app`;
- the auth users from `E2E_ACCOUNTS` (`createUser` with a fixed uid, skipped when they exist);
- `admins/e2e-admin`;
- `users/e2e-member` (a valid `userProfile`: locale en, prefs false, `notificationsSeenAt` null),
  plus `users/e2e-member/saved/midjourney`.

It validates `seedData` with the schemas before writing and exits non-zero on any error. Split it into
helpers under `firebase/seed/` if it would pass 200 lines.

### 3. Logos

Put `app/public/logos/<slug>.png` for all 8 tools, each downscaled to at most 512 px with
`sips -Z 512 -s format png <src> --out <dst>`. For ChatGPT, use the white asset above.

### 4. `firebase/seed/README.md`

Say that the content is **sample data** (prices and plans were taken from the prototype and need
human verification), how to seed (`pnpm seed` with emulators running), and which tutorial durations
are estimated.

## Acceptance

These are the INV-14 oracle checks O1 is writing in `firebase/seed/seed.test.ts`. When O1 merges, the
manager merges trunk into your branch. Meet them now:
- every category, tool, update and bundle, plus `appConfig`, parses with its schema;
- each key equals the document's `slug`;
- the id sets equal `SEED_TOOL_SLUGS`, `SEED_BUNDLE_SLUGS` and `SEED_CATEGORY_IDS`;
- every `similarToolIds`, `complementaryToolIds`, bundle `toolIds`, update `toolId` and `categoryId` resolves;
- `fromPriceCents === cheapestPaidPlanCents(plans)`;
- at least 4 tutorials per tool, with unique ids;
- non-empty `bg` tagline and description;
- `checkoutEnabled === false`;
- a midjourney update within 30 days.

Also:
- [ ] Reviews parse with `reviewSchema`, and every tool's `rating` equals Σ/count of its reviews.
- [ ] `scripts/emulators-exec.sh "scripts/seed.sh && scripts/seed.sh"` → exit 0 twice (idempotent).
- [ ] `scripts/gate.sh --full --task S1 --base 376cd00` → `GATE PASS`.

## Out of scope
Rules, app code, extra tools beyond the 8, and real pricing research (it is sample data).

## Stop conditions (do not guess)
- A tool has fewer than 4 verifiable tutorials after a reasonable search. Use the verified ones, flag
  it, and the manager decides.
- `firebase-admin` cannot reach the emulators.

## Boundaries
- No push, no deploy, no new dependencies, and no network beyond WebSearch plus YouTube oEmbed/watch pages.
- No comments. Named `git add` only.
- Commit as `feat(seed): sample catalogue, emulator seed script and logos [S1]` with a why-body and
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Hand-back
Fill `~/Repos/ai-explore/prompt/overnight/templates/handback.md` into
`~/Repos/ai-explore/prompt/overnight/tasks/S1/handback.md`. List every tutorial id with its oEmbed status.
