# R1 hand-back · round 1

**Head sha:** 3a14181 · **Gate:** `scripts/gate.sh --full --task R1 --base ef3c37c --expect-pending 18-26` → exit 0, `GATE PASS`
(biome, conventions, node-tests, typecheck, test, rules 140/140, e2e 4 passed / 16 fixme-skipped, scope, oracle, pending = 18–26)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| INV-1, 16 tests (catalogue read): get/list published only, admin sees drafts, `updates` group by `toolId` | `firebase/firestore.rules:200` categories, `:206` config, `:217` tools (`published == true \|\| isAdmin()`), `:222` updates, `:252` bundles, `:295` `/{path=**}/updates` | `scripts/test-rules.sh` | 0 |
| INV-1, 2 tests (review groups): reviews by `authorUid` across tools | `firebase/firestore.rules:227` reviews `read: true`, `:300` `/{path=**}/reviews` | `scripts/test-rules.sh` | 0 |
| INV-2, 11 tests: catalogue writes are admin-only | `isAdmin()` `:14` on every catalogue `write` (`:200`, `:206`, `:217`, `:222`, `:252`); the only non-admin tool update is `isRatingUpdate()` `:70` | `scripts/test-rules.sh` | 0 |
| INV-3, 12 tests: owner-only `users/{uid}` tree | `isOwner(uid)` `:10` on `/users/{uid}` `:258` and every subcollection; `users` has `get` only, no `list` | `scripts/test-rules.sh` | 0 |
| INV-4, 11 tests: no client writes `admins/*` or `subscriptions/*` | `:212` admins (`get` if `isOwner`, nothing else), `:289` subscriptions (`read` if `isOwner`, nothing else) | `scripts/test-rules.sh` | 0 |
| INV-5, 17 tests: review create paired with count +1, sum +r | `isValidReviewCreate()` `:109` + `isValidReview()` `:91` + `ratingMovedBy(slug, 1, rating)` `:63`; tool side `isRatingUpdate()` `:70` (count +1 ⇒ `!exists && existsAfter` and sum = `getAfter(review).rating`) | `scripts/test-rules.sh` | 0 |
| INV-6, 13 tests: edit moves sum by r2 − r1, delete moves count −1 / sum −r | `isValidReviewEdit()` `:116` + `ratingMovedBy(slug, 0, r2 − r1)` / `ratingMovedBy(slug, −1, −r)` `:227`; tool side `isRatingUpdate()` `:70` (count 0 ⇒ sum = after − before, non-zero; count −1 ⇒ `exists && !existsAfter`) | `scripts/test-rules.sh` | 0 |
| INV-7, 2 tests: interleaved and concurrent batches keep the aggregate exact | `ratingMovedBy()` `:63` + `isRatingUpdate()` `:70`; deltas read from `request.resource.data` vs `resource.data` after `increment()` resolves | `scripts/test-rules.sh` | 0 |
| INV-8, 8 tests: no writing another user's review, no second review | `isOwner(authorUid)` on review writes `:227`; doc id = uid; a second `set` lands on `update`, where `isValidReviewEdit()` keeps `createdAt`/`helpfulCount` immutable and `ratingMovedBy` keeps count fixed | `scripts/test-rules.sh` | 0 |
| INV-9, 13 tests: one vote per voter, `helpfulCount` ±1 in the same batch | vote side `:240` `isValidVote()` `:139` + `helpfulMovedBy()` `:121`; review side `isHelpfulCountUpdate()` `:127` (voter ≠ author, only `helpfulCount`, ±1 with `exists`/`existsAfter` of the caller's vote) | `scripts/test-rules.sh` | 0 |
| INV-10, 22 tests (11 collections/interest + 11 profile/saved): exact keys, ranges, allow-lists | `exactKeys()` `:22`, `isValidProfile()` `:144`, `isValidSaved()` `:173`, `isValidCollection()` `:178` (trimmed name 1–40, `COLLECTION_ICONS`, `ACCENTS`, ≤ 50 toolIds, int order ≥ 0), `isValidBundleInterest()` `:194` | `scripts/test-rules.sh` | 0 |
| INV-11, 7 tests: `notificationsSeenAt` only as `request.time` | `isValidProfileCreate()` `:158` (null on create), `isValidProfileUpdate()` `:165` (`unchanged` or `isServerTime`) | `scripts/test-rules.sh` | 0 |
| INV-12, 5 tests: bundleInterest owner-write, admin-only collection group | `:278` owner `read/create/update/delete`; `:305` `/{path=**}/bundleInterest` `list` if `isAdmin()` | `scripts/test-rules.sh` | 0 |
| Smoke stays green (1 test) | `firebase/tests/rules/smoke.test.ts` | `scripts/test-rules.sh` | 0 |
| No assertion changed; only `describe.skip(` → `describe(` in 14 files | `git diff ef3c37c..HEAD -- firebase/tests` | gate `oracle` step | 0 |
| Indexes: `updates` (toolId ASC, publishedAt DESC) and `reviews` (authorUid ASC, updatedAt DESC) collection-group composites; per-tool `reviews.updatedAt` | `firebase/firestore.indexes.json` | — | — |
| Public pages still read under the new rules | seeded emulators + `next start`: `/`, `/bg`, `/tools/midjourney`, `/tools/chatgpt`, `/bundles`, `/bundles/startup-founder-pack`, `/compare` → 200; `/tools/does-not-exist` → 404; no permission errors in the server log | ad-hoc script under `emulators-exec.sh` | 0 |

Totals: 139 INV tests + 1 smoke = 140 green. Both INV-1 files are un-skipped and green.

## Decisions I made that the brief didn't dictate
- **Per-tool `reviews.updatedAt DESC` is a field override, not a composite.** Firestore rejects a composite index with a single field ("this index is not necessary, configure using single field index controls"), and collection-scope single-field ASC/DESC indexes exist automatically. I declared it as a `fieldOverrides` entry that keeps the collection-scope ASC/DESC/CONTAINS indexes, so the requirement is stated without making a deploy fail.
- **Added a `reviews.authorUid` COLLECTION_GROUP ASC field override.** Account deletion and the oracle's visitor query use `where('authorUid','==',uid)` with no `orderBy`. In production that needs a collection-group single-field index; the composite does not serve it.
- **Admins are not constrained on `rating`.** This follows O1's contract ("catalogue: admin only"). An admin who writes a whole tool doc with a stale `rating` could still corrupt the aggregate. Tightening this to `unchanged(['rating'])` for admins is a possible follow-up, but the admin lane's write shape would need to match it.
- **A review edit may also change `authorName`, `authorPhotoUrl` and `locale`, all validated.** The contract makes only `toolId`, `authorUid`, `helpfulCount` and `createdAt` immutable. This lets a display-name change propagate later.
- **Updates to `saved`, `bundleInterest` and collections are allowed** for idempotent "set again" writes. `savedAt` must be `request.time`. `bundleInterest.createdAt` must be unchanged or `request.time`. A collection's `createdAt` must be unchanged.
- **`get` of a missing tool or bundle is denied to non-admins**, the same as for a draft. This stops anyone learning which draft slugs exist. The app already resolves tool and bundle pages from the published list, so a missing tool still returns 404.
- **Admin `bundleInterest` access is `list` only on the group match**, so admins can run the count queries but cannot `get` an individual user's interest doc.
- **Reviews are allowed on unpublished tools.** The spec doesn't say otherwise, and I did not add a new invariant.

## Slots
- Filled: `firebase/firestore.rules`, `firebase/firestore.indexes.json`
- Consumed while still stubbed: `ToolDetailView` and `BundleDetailView` return `null`. The e2e smoke only visits the library, so I checked the tool and bundle routes for HTTP 200/404, not for rendered content.

## Not done, and why
- Nothing in scope.

## For the manager
- **Gate defect:** `scripts/gate.sh` `step_oracle` uses `mapfile`. That builtin doesn't exist in macOS `/bin/bash` 3.2, which `#!/usr/bin/env bash` resolves to here. The log prints `mapfile: command not found` and the per-line ownership check silently does nothing. The "oracle changed beyond markers" check still runs, so assertion edits are caught, but un-skipping an INV the task doesn't own is not. Fix this by replacing `mapfile` with a `while read` loop, or by requiring Homebrew bash. I checked R1 manually: only INV-1…12 were un-skipped.
- **Seams for later lanes:**
  - `reviewBatch.ts` must commit each review write together with the tool `rating` update in the exact shapes used by the oracle's `firebase/tests/rules/batches.ts`.
  - Edits use `{ rating, body, updatedAt: serverTimestamp() }`, and the tool update is omitted when the rating is unchanged.
  - Votes are `set(votes/{uid}, { createdAt: serverTimestamp() })` plus `helpfulCount: increment(±1)`.
  - Profile create requires `notificationsSeenAt: null` and `createdAt: serverTimestamp()`.
  - Collections require `createdAt: serverTimestamp()` on create and an unchanged `createdAt` on update.
- **Account deletion (U-lanes):** delete each review in its own batch with `count −1 / sum −r`. Votes left under a deleted review are orphaned, and the rules can't cascade them.
- **Notifications query:** `collectionGroup('updates')` with `where('toolId','in',chunk)` plus `orderBy('publishedAt','desc')` matches the declared composite.
