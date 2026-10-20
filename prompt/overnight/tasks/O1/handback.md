# O1 hand-back · round 1

**Head sha:** c7b3e60 (branch `overnight/O1`, base f9b8a32) · **Gate:** `scripts/gate.sh --quick` → exit 0 (`GATE PASS`, pending `1 2 3 4 5 6 7 8 9 10 11 12 14 18`)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| INV-1 skipped block, 8 positive + 8 negative | firebase/tests/rules/inv-01-catalogue-read.test.ts:23 | see un-skip row | — |
| INV-2 skipped block, 4 + 7 | firebase/tests/rules/inv-02-catalogue-write.test.ts:12 | ″ | — |
| INV-3 skipped block, 4 + 8 | firebase/tests/rules/inv-03-user-tree.test.ts:28 | ″ | — |
| INV-4 skipped block, 3 + 8 | firebase/tests/rules/inv-04-admins-subscriptions.test.ts:20 | ″ | — |
| INV-5 skipped block, 3 + 14 | firebase/tests/rules/inv-05-review-create.test.ts:20 | ″ | — |
| INV-6 skipped block, 4 + 9 | firebase/tests/rules/inv-06-review-edit-delete.test.ts:20 | ″ | — |
| INV-7 skipped block, 2 positive (5 rounds, 4 concurrent pairs) | firebase/tests/rules/inv-07-rating-interleaved.test.ts:10 | ″ | — |
| INV-8 skipped block, 2 + 6 | firebase/tests/rules/inv-08-review-ownership.test.ts:12 | ″ | — |
| INV-9 skipped block, 3 + 10 | firebase/tests/rules/inv-09-helpful-votes.test.ts:25 | ″ | — |
| INV-10 skipped blocks, 6 + 16 | firebase/tests/rules/inv-10-profile-saved.test.ts:19, firebase/tests/rules/inv-10-collections-interest.test.ts:19 | ″ | — |
| INV-11 skipped block, 3 + 4 | firebase/tests/rules/inv-11-notifications-seen.test.ts:10 | ″ | — |
| INV-12 skipped block, 2 + 3 | firebase/tests/rules/inv-12-bundle-interest.test.ts:21 | ″ | — |
| INV-14 skipped block, 9 tests (plain vitest) | firebase/seed/seed.test.ts:20 | `pnpm --filter @ai-explore/firebase test` | 0 (9 skipped) |
| INV-18 skipped block, 4 tests (jsdom) | app/src/features/share/utils/copyToClipboard.test.ts:6 | `pnpm --filter @ai-explore/app test` | 0 (4 skipped) |
| Un-skipped against deny-all: every positive fails, every negative passes | all rules files | `scripts/test-rules.sh` (with `.skip` removed, then restored; tree clean after) | 1: 44 failed / 94 passed of 138. All 44 failures are `allows …` tests with PERMISSION_DENIED. The 94 passes are 93 `denies …` tests plus smoke |
| Committed state is skipped | — | `scripts/test-rules.sh` | 0: 1 passed, 137 skipped |
| Quick gate | — | `scripts/gate.sh --quick` | 0, `GATE PASS`, pending = {1–12, 14, 18} |
| Full gate | — | `scripts/gate.sh --full --task O1 --base f9b8a32` | 0, `GATE PASS` (scope, oracle, rules, e2e green) |

## Decisions I made that the brief didn't dictate
- **I checked that the oracle can be satisfied without committing any rules or code.** I wrote a throwaway rules file in my scratchpad (`/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/o1/probe.rules`). I copied it over `firebase/firestore.rules` only for the test run, then restored the file with `git checkout`. Results:
  - All 138 rules tests pass against it.
  - 16 mutation runs each broke the expected test: dropped key allow-lists, unpaired aggregates, other tool keys, self-votes, ±2 deltas, `notificationsSeenAt`, trim, collection-group, unfiltered list, `authorUid`, immutables, owner-only, subscription writes, admins self-create.
  - An allow-all rules file fails all 93 negative tests.
  - I did the same for INV-14 (a temporary synthetic seed, plus a broken variant that fails 2 tests) and for INV-18 (a temporary reference implementation passes 4/4).
  - Nothing of this is committed. Whether R1 sees the probe is your call; withholding it keeps R1 independent of my reading.
- **INV-7 waits for both commits before reporting.** It uses `concurrently()` (`Promise.allSettled`, then rethrow) instead of a bare `Promise.all`. Both batches still start before either is awaited, so they are just as concurrent. With a bare `Promise.all`, a rejected commit left its sibling in flight. Under deny-all, that made the next test's `clearFirestore` fail with an emulator "Transaction lock timeout".
- **Positive tests start with `allows`, negative tests with `denies`.** Negative tests seed state only through `withSecurityRulesDisabled`, never through client writes. That makes the deny-all classification exact.
- **INV-1 goes slightly beyond `get`.** A visitor can also *list* `categories`, a tool's `updates` subcollection and a tool's `reviews`. The library and tool pages need these lists, and SPEC §2.1 says "Read: anyone".
- **Admins get nothing beyond the contract.** An admin cannot read another user's profile (owner-only), cannot list `admins`, and cannot write another user's `bundleInterest`. Admin reads of drafts and unfiltered lists are in INV-1.
- **INV-11 denies writing `notificationsSeenAt` back to `null`.** "Only ever written as request.time" covers that case. Also, a profile *create* with `serverTimestamp()` instead of `null` is denied in INV-10, because the contract says "null on create".
- **INV-18 reading of "never throws":** when `execCommand` throws, the function resolves `false`. The textarea must be gone after the normal fallback paths; I do not assert removal in the throw path.
- **INV-14 readings:**
  - `youtubeId` uniqueness is checked per tool, not across all tools.
  - "Within the last 30 days of seed construction" means `publishedAt` is in `(now − NOTIFICATION_WINDOW_DAYS, now]`, with `now` taken right after `./data` is imported.
- **rules-unit-testing 6 types its contexts as the compat `Firestore`**, which is not assignable to the modular `Firestore` type. There is one `as unknown as Firestore` cast, in `fixtures.ts`. At runtime the modular functions unwrap `_delegate`, as the existing smoke test already relies on.

## Slots
- Filled: none (tests only)
- Consumed while still stubbed: `firebase/seed/data/index.ts` (empty: INV-14 fails 2/9 when un-skipped), `app/src/features/share/utils/copyToClipboard.ts` (returns false: INV-18 fails 3/4 when un-skipped)

## Not done, and why
- **No test covers a collection-group read over `reviews`.** SPEC §2.3 says profile and account deletion find a user's reviews with a collection-group query on `authorUid`, but the closed contract leaves it out, and the brief says to encode exactly the contract.
- **Contract tension (flag): account deletion and subscriptions conflict.** "Deleting own user docs (all subcollections) is allowed" conflicts with INV-4, "subscriptions not writable by any client". I followed INV-4: the owner cannot delete subscriptions. The account-deletion test covers the profile, saved, collections and bundleInterest.
- **Contract tension (flag): categories have no `slug` field.** "Key equals the doc's slug" is therefore checked for tools and bundles only. Each `updates[key]` list is checked as `toolId === key`. Categories are covered by the id-set equality.

## For the manager
- **R1:** each file calls `useRules()` (in `firebase/tests/rules/fixtures.ts`) inside its `describe.skip`, so un-skipping a file brings its own environment. Rules need `getAfter`/`existsAfter` on both sides of each pairing:
  - the tool `rating` update looks up `tools/{slug}/reviews/{request.auth.uid}`;
  - the review update has two branches: the author edit (`rating`, `body`, `updatedAt`) and the voter's `helpfulCount` ±1.
- **S1:** compute update `publishedAt` relative to `Date.now()` at module load, never a hard-coded date, or INV-14's recent-update check goes stale. Seed `admins/{uid}` as an existence-only doc (the tests seed `{}`).
- **T2:** `copyToClipboard` must check `navigator.clipboard?.writeText` before calling it, run the fallback inside try/catch, and remove the textarea.
- **U3 / follow-ups.md:**
  - R1 must add a `reviews` collection-group rule (find own reviews by `authorUid`) before account deletion can use that query. It has no oracle yet.
  - Orphaned `subscriptions` after account deletion, if INV-4 stays as written.
