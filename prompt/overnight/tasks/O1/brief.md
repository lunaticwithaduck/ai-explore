**Template:** brief-v1 · **Task:** O1 · **Phase:** 2 · **Model:** opus · **Base sha:** f9b8a32

# O1 — The oracle: security-rules invariants INV-1 to INV-12, plus INV-14 and INV-18

You write **tests only**. They are the acceptance oracle a different worker (R1) must later satisfy
by writing `firebase/firestore.rules`. You never write rules or implementation code. Every
invariant test ships **skipped**: `describe.skip('INV-<n>: …', …)`. The skip marker is the only
thing R1 may change.

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md` (binding) — §Firebase in particular.
2. `~/Repos/ai-explore/prompt/SPEC.md` §1, §2 (the whole Firestore model) and §Invariants 1–12, 14, 18.
3. `packages/schemas/src/*.ts` — the document shapes (field names, enums, limits such as
   `COLLECTION_ICONS`, `ACCENTS`, `COLLECTION_LIMITS`, `REVIEW_LIMITS`, `BUNDLE_PERIODS`, `COLLECTIONS`,
   `SUBCOLLECTIONS`). Import constants from `@ai-explore/schemas` rather than retyping them.
4. Existing harness: `firebase/tests/rules/environment.ts` (`createRulesEnvironment()`),
   `firebase/tests/rules/smoke.test.ts` (exemplar), `scripts/test-rules.sh` (runs vitest inside the
   emulators with your SLOT's ports), `firebase/vitest.rules.config.ts`.
5. Contracts: `firebase/seed/{types,catalog-ids,accounts}.ts`, `firebase/seed/data/index.ts` (stub,
   empty — S1 fills it), `app/src/features/share/utils/copyToClipboard.ts` (stub — T2 implements).

## Where you work
- Worktree `~/Repos/ai-explore-wt/O1`, branch `overnight/O1`, `SLOT=1`.
- Write only `scope.txt` paths. Hand-back goes to `~/Repos/ai-explore/prompt/overnight/tasks/O1/handback.md`.

## The rules contract your tests encode (closed decisions — encode exactly these)

Helpers you may add under `firebase/tests/rules/` (e.g. `fixtures.ts` for seeding with
`env.withSecurityRulesDisabled`, typed doc builders, `clearFirestore` in `beforeEach`).

**Admin** = a document exists at `admins/{uid}`.

**Catalogue (`categories`, `tools`, `tools/{slug}/updates`, `bundles`, `config/app`)**
- Anyone (incl. unauthenticated) may `get` a published tool/bundle, any category, any update, `config/app`.
- `get` of a tool/bundle with `published == false` is denied to non-admins, allowed to admins.
- Listing `tools`/`bundles` is allowed only with `where('published','==',true)` for non-admins (an
  unfiltered list is denied); admins may list unfiltered.
- Collection-group query over `updates` (e.g. `where('toolId','in',[...])`) is allowed for anyone.
- Create/update/delete of any catalogue doc: admin only — except the rating aggregate path below.

**Rating aggregate (INV-5…8)** — `tools/{slug}.rating = { count, sum }`; review doc id = author uid.
- Create review: one batch = `set(tools/{s}/reviews/{uid}, review)` + `update(tools/{s}, { 'rating.count': increment(1), 'rating.sum': increment(r) })`.
  Review fields on create, exactly: `toolId` (== path slug), `authorUid` (== uid == doc id), `rating`
  (int 1–5), `body` (string ≤ 2000, may be empty), `authorName` (string 1–60), `authorPhotoUrl`
  (string or null), `locale` (`en`|`bg`), `helpfulCount` (== 0), `createdAt` and `updatedAt`
  (== `serverTimestamp()`, i.e. `request.time`). Any other key → denied.
- Edit own review r1→r2: batch `update(review, { rating, body?, updatedAt: serverTimestamp() })` +
  `update(tool, { 'rating.sum': increment(r2 - r1) })` (omit the tool update when r1 == r2). `toolId`,
  `authorUid`, `helpfulCount`, `createdAt` are immutable for the author.
- Delete own review: batch `delete(review)` + `update(tool, { 'rating.count': increment(-1), 'rating.sum': increment(-r) })`.
- Denied: review write without the matching tool update; tool `rating` change without the matching
  review write; wrong deltas; a non-admin tool update touching any key other than `rating`; writing
  another user's review; creating a second review (doc already exists → the create path must fail).
- INV-7: two users, several rounds of interleaved create/edit/delete, including `Promise.all` of two
  concurrent create batches; afterwards (read with rules disabled) `rating.sum` == Σ remaining ratings and
  `count` == number of remaining reviews.

**Helpful votes (INV-9)** — `tools/{s}/reviews/{authorUid}/votes/{voterUid}` with `{ createdAt: serverTimestamp() }`.
- Vote: batch `set(vote)` + `update(review, { helpfulCount: increment(1) })`; unvote: `delete(vote)` + `increment(-1)`.
- Denied: voting on your own review; a second vote; `helpfulCount` change without the vote doc
  change (or vice versa); deltas other than ±1; vote doc id ≠ voter uid; extra keys.
- Votes and reviews are readable by anyone.

**User tree (INV-3, 4, 10, 11)** — owner-only read/write for `users/{uid}` and every subcollection.
- `users/{uid}` create with exactly: `displayName` (1–60), `photoUrl` (string|null), `locale` (en|bg),
  `prefs` `{ productUpdates: bool, emailDigest: bool }` (exactly those two keys), `notificationsSeenAt`
  (null on create), `createdAt` (== request.time). Update may change displayName, photoUrl, locale,
  prefs, notificationsSeenAt; `createdAt` immutable.
- INV-11: `notificationsSeenAt` may only ever be written as `request.time` (a client `Timestamp`/`Date` is denied).
- `saved/{toolSlug}`: exactly `{ savedAt: request.time }`.
- `collections/{id}`: exactly `name` (trimmed length 1–40), `icon` ∈ `COLLECTION_ICONS`, `color` ∈
  `ACCENTS`, `toolIds` (list, size ≤ 50), `order` (int ≥ 0), `createdAt` (== request.time on create,
  immutable on update).
- `bundleInterest/{bundleSlug}`: exactly `{ period ∈ BUNDLE_PERIODS, createdAt: request.time }`; owner
  read/write; admins may run a collection-group read of `bundleInterest`; non-admins may not (INV-12).
- INV-4: `admins/*` and `users/*/subscriptions/*` are not writable by any client — owner, other user,
  admin, or unauthenticated. The owner may read their own subscriptions; a user may read only their own `admins/{uid}` doc.
- Deleting own user docs (all subcollections) is allowed (account deletion).

## INV-14 — `firebase/seed/seed.test.ts`
Import `seedData` from `./data` and the slug lists from `./catalog-ids`. Assert, in `describe.skip('INV-14: …')`:
every category/tool/update/bundle/appConfig parses with its schema; the key equals the doc's `slug`;
the tool, bundle and category id sets equal `SEED_TOOL_SLUGS` / `SEED_BUNDLE_SLUGS` / `SEED_CATEGORY_IDS`;
every `similarToolIds`, `complementaryToolIds`, bundle `toolIds` and update `toolId` resolves; every
tool's `categoryId` resolves; `pricing.fromPriceCents === cheapestPaidPlanCents(plans)`; ≥ 4 tutorials
per tool with unique `youtubeId`s; every tool has a non-empty `bg` for `tagline` and `description`;
`appConfig.checkoutEnabled === false`; at least one update for `E2E_ACCOUNTS.member.savedToolIds[0]`
has `publishedAt` within the last 30 days of seed construction time. It runs in plain vitest (no emulator).

## INV-18 — `app/src/features/share/utils/copyToClipboard.test.ts`
Contract: `copyToClipboard(text): Promise<boolean>` — resolves `true` when the Clipboard API succeeds;
when `navigator.clipboard.writeText` rejects **or is undefined**, falls back to a temporary off-screen
`textarea` + `document.execCommand('copy')` and resolves its boolean result; never throws or rejects.
Test all four cases with vi mocks (jsdom env is already configured for `app`). `describe.skip('INV-18: …')`.

## Acceptance
- [ ] Every INV-1…12, 14, 18 has at least one `describe.skip('INV-<n>: …')` block with real assertions
      (`assertSucceeds`/`assertFails`/`expect`), not placeholders. Positive cases are mandatory too
      (e.g. the correct batch succeeds), so rules cannot pass by denying everything.
- [ ] Un-skip temporarily and run `scripts/test-rules.sh`: against today's deny-all rules every
      positive case fails and every negative case passes — record counts in the hand-back. Then
      restore `.skip` (the committed state is skipped).
- [ ] `scripts/gate.sh --quick` → `GATE PASS`; pending list printed equals {1–12, 14, 18}.
- [ ] `scripts/gate.sh --full --task O1 --base f9b8a32` → `GATE PASS`.

## Out of scope
`firestore.rules` (R1), seed data (S1), the clipboard implementation (T2), e2e (O2).

## Stop conditions (do not guess)
- A rule in the contract above cannot be tested with `@firebase/rules-unit-testing` 6 / firebase 13 as
  written (say exactly which and why) — test the nearest observable property and flag it.
- The contract contradicts SPEC or the schemas — follow the contract here, flag it.

## Boundaries
No push, no deploy, no new deps, no comments except `// INV-n` labels. `git add` named files only.
Commit: `test(firebase): rules, seed and share oracles for INV-1–12, 14, 18 [O1]` + why-body +
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hand-back
Fill `~/Repos/ai-explore/prompt/overnight/templates/handback.md` into `~/Repos/ai-explore/prompt/overnight/tasks/O1/handback.md`.
