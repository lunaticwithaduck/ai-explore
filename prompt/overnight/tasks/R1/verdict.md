# R1 verdict · verifier-v1

Worktree `~/Repos/ai-explore-wt/R1`, base `c0ee6bb` (trunk, which includes the `mapfile` gate fix), head `caab940`
(the merge of trunk into `3a14181`). `git diff --stat c0ee6bb..caab940` shows 16 files: `firebase/firestore.rules`,
`firebase/firestore.indexes.json`, and 14 oracle files. I edited nothing in the worktree. `git status --porcelain` is empty
after every run.

## Commands run
- `scripts/test-rules.sh` → exit 0. 15 files and 140 tests passed (139 INV tests plus 1 smoke). Per-file counts match the hand-back: 16, 2, 11, 12, 11, 17, 13, 2, 8, 13, 11, 11, 7, 5 and smoke 1.
- `scripts/gate.sh --full --task R1 --base c0ee6bb --expect-pending 18-26 --log <scratchpad>/verify-r1/gate.log` → exit 0, `GATE PASS`. Every step exited 0: biome, conventions, node-tests, typecheck, test, rules (140/140), e2e (4 passed, 16 fixme-skipped), scope, oracle, and pending = 18–26. I logged to the scratchpad so the worker's `gates.log` was not overwritten.
- Probe run → exit 0, 168/168 passed. I wrote 28 throwaway tests in `<scratchpad>/verify-r1/zz-verify-probe.test.ts` and copied them into `firebase/tests/rules/` only for one `scripts/test-rules.sh` run. I deleted them afterwards and `git status` was clean again. Outcomes are in `<scratchpad>/verify-r1/probe-results.txt`.

## Blind pass (SPEC §1, §2, Invariants 1–12) → paths and the denials they need
Reads:
- **R-a.** categories, `config/app`, updates (by doc and as a collection group with `toolId in` and `publishedAt`), and reviews (by tool and as a collection group by `authorUid`) are readable by anyone.
- **R-b.** tools and bundles: `get` and `list` are allowed only when `published == true`, and lists must carry that filter. Admins see drafts.
- **R-c.** `admins/{uid}`: only the owner may read it.
- **R-d.** `users/**`: owner only. Admins may list `bundleInterest` as a collection group. Owners may read their own subscriptions.

Writes:
- **W-a.** Catalogue (categories, tools, updates, bundles, config): admin only. The single exception is the tool `rating` field, which may change only paired with the caller's own review create, edit or delete, with an exact delta in both directions.
- **W-b.** Reviews:
  - The doc id is the caller's uid, `authorUid` equals the doc id, and `toolId` equals the slug.
  - `rating` is an int from 1 to 5, `body` is at most 2000 characters, and keys are exact.
  - `helpfulCount` is 0 on create. `createdAt` and `updatedAt` are server time.
  - There is no second review, and nobody writes another user's review.
- **W-c.** Votes:
  - The doc id is the voter's uid, the voter is not the author, keys are exactly `createdAt`, and `createdAt` is server time.
  - Each vote is paired with `helpfulCount` ±1.
  - There is no second vote, and nobody deletes another user's vote.
  - `helpfulCount` changes only through that pairing, and no other field of someone else's review changes.
- **W-d.** User docs (profile, saved, collections, bundleInterest):
  - Owner only, with exact keys and value ranges/allow-lists.
  - Every timestamp is server time. `notificationsSeenAt` may only be written as `request.time`.
  - Owners may delete their own docs (account deletion).
- **W-e.** No client may write `admins/*` or `users/*/subscriptions/*`, not even an admin.
- **W-f.** A collection-group match must not let a client inject documents into public groups (`updates`, `reviews`).

Diffed against the brief: the brief and O1's contract cover R-a…R-d and W-a…W-f. SPEC raises points the brief does not address; they are listed as BRIEF GAP lines below.

## Criteria
PASS — INV-1 catalogue read: anyone reads categories, `config/app`, updates and reviews; tools and bundles only when published; admins read drafts; reviews by author as a collection group — evidence: firebase/firestore.rules:200-203, :206-207, :217-218, :222-223, :227-228, :252-253, :295-302; probe P14a/P14b (unfiltered list denied), P14c (`published == true` list allowed); `scripts/test-rules.sh` → exit 0 (16+2 tests)
PASS — INV-2 catalogue writes are admin only; the only non-admin tool write is the rating path — evidence: firebase/firestore.rules:202, :208, :219-220, :224, :254, :70-89; probes P01 (non-admin set-merge creating a tool) and P05 (publishing a draft through the rating batch) denied; `scripts/test-rules.sh` → exit 0 (11 tests)
PASS — INV-3 owner-only `users/{uid}` tree, with no recursive wildcard under users — evidence: firebase/firestore.rules:258-292; probes P25a/P25b, P16a/P16b/P16d (collection-group reads of saved, collections and subscriptions) and P17c/P17d (admin list or get of users) denied; `scripts/test-rules.sh` → exit 0 (12 tests)
PASS — INV-4 no client writes `admins/*` or `subscriptions/*`, admins included — evidence: firebase/firestore.rules:212-214, :289-291; probes P17a/P17b (admin) and P28b (listing admins) denied; `scripts/test-rules.sh` → exit 0 (11 tests)
PASS — INV-5 review create is paired in both directions: review side `ratingMovedBy(+1, +r)`, tool side count +1 ⇒ `!exists && existsAfter` and sum = `getAfter(review).rating` — evidence: firebase/firestore.rules:63-67, :82-83, :91-113, :229-231; probes P02 (rating moved on a second tool), P03 (two tool writes in one batch; aggregate left at {1,4}), P04 (extra key in `rating`), P23 (float count) and P27 (unauthenticated) denied; `scripts/test-rules.sh` → exit 0 (17 tests)
PASS — INV-6 edit moves sum by r2−r1 with count fixed; delete moves count −1 and sum −r — evidence: firebase/firestore.rules:84-87, :116-118, :232-237; probes P24 (no-op/count bump on edit) and P26a/P26b (wrong delete delta; count change on edit) denied; `scripts/test-rules.sh` → exit 0 (13 tests)
PASS — INV-7 interleaved and concurrent `increment()` batches keep the aggregate exact — evidence: firebase/firestore.rules:70-89 (deltas use `request.resource.data` vs `resource.data`); `scripts/test-rules.sh` → exit 0 (2 tests)
PASS — INV-8 no writing another user's review; no second review — evidence: firebase/firestore.rules:229, :232, :236 (`isOwner(authorUid)`), :96, :117; `scripts/test-rules.sh` → exit 0 (8 tests)
PASS — INV-9 one vote per voter, voter ≠ author, `helpfulCount` ±1 paired in both directions — evidence: firebase/firestore.rules:121-141, :235, :240-247; probes P07/P08 (voter changing body or rating), P09 (author deleting a voter's vote), P10 (vote overwrite), P11 (bumping a second review) and P12 (+2) denied; `scripts/test-rules.sh` → exit 0 (13 tests)
PASS — INV-10 exact keys and ranges on every user-writable doc — evidence: firebase/firestore.rules:22-24, :93-94, :140, :146-154, :174, :180-190 (icons and accents match packages/schemas/src/user.ts:5-22 and common.ts:23-32), :195-196; `scripts/test-rules.sh` → exit 0 (11+11 tests)
PASS — INV-11 `notificationsSeenAt` is null on create, then only unchanged or `request.time` — evidence: firebase/firestore.rules:158-170; `scripts/test-rules.sh` → exit 0 (7 tests)
PASS — INV-12 `bundleInterest` is owner-write; the collection-group `list` is admin only — evidence: firebase/firestore.rules:278-286, :305-307; probe P16c (non-admin collection-group read) denied; `scripts/test-rules.sh` → exit 0 (5 tests)
PASS — smoke test stays green — evidence: firebase/tests/rules/smoke.test.ts; `scripts/test-rules.sh` → exit 0
PASS — no assertion changed; only INV-1…12 un-skipped — evidence: `git diff c0ee6bb..caab940 -- firebase/tests` shows only `describe.skip(` → `describe(` in 14 files (line ~10–28 of each), and `oracle` passes with the fixed loop from c0ee6bb; `scripts/gate.sh … --task R1` oracle step → exit 0
PASS — full gate — evidence: `scripts/gate.sh --full --task R1 --base c0ee6bb --expect-pending 18-26` → exit 0, `GATE PASS`
PASS — public library still renders (e2e smoke, en and bg, mobile and desktop) — evidence: app/e2e/smoke.spec.ts:3, :9; server readers use `where('published','==',true)` at app/src/api/server/catalogue.ts:20-21 and :37-38, `config/app` get at :49, and the updates list at app/src/api/server/updates.ts:16-18, all of which the rules permit; gate e2e step → exit 0 (4 passed)
BRIEF GAP — "tool and bundle pages still render in the e2e smoke run": the smoke spec covers only the library, and `ToolDetailView`/`BundleDetailView` are still stubs. Rendering cannot be shown yet; the reads they will use are permitted (see above). This is not a worker fault — evidence: app/e2e/smoke.spec.ts:3-14; gate e2e → exit 0
PASS — design: named helpers `isSignedIn`, `isAdmin`, `isOwner`, `onlyKeys`, `unchanged` and `isServerTime`, plus per-doc validators — evidence: firebase/firestore.rules:6-36, :91-197
PASS — design: `getAfter`/`existsAfter` pairing in both directions for `rating` and `helpfulCount` — evidence: firebase/firestore.rules:63-89 and :121-137, paired with :231, :234, :237, :245, :246
PASS — design: the published proof on `list`, and admin as `exists(admins/uid)` — evidence: firebase/firestore.rules:218, :253, :15
PASS — design: collection-group matches cover updates (`toolId in` + `publishedAt`), reviews by `authorUid`, and admin bundleInterest counts. They are no broader than safe: `{path=**}/updates` and `{path=**}/reviews` grant read on any depth, but no client can create an `updates` or `reviews` doc outside `tools/{slug}`, so nothing can be injected into those groups — evidence: firebase/firestore.rules:295-307; probes P13a–P13d (users/{me}/updates, users/{me}/reviews, top-level updates, nested updates) denied
PASS — indexes: `updates` collection group (toolId ASC, publishedAt DESC), `reviews` collection group (authorUid ASC, updatedAt DESC), a collection-group single-field `authorUid`, and per-tool `updatedAt` declared as a field override — evidence: firebase/firestore.indexes.json:3-18, :20-39
PASS — client-trusted timestamps: none on any user-writable doc — evidence: firebase/firestore.rules:105, :112 (review), :140 (vote), :160-161, :167-169 (profile), :174 (saved), :273-274 (collection), :282, :285 (bundleInterest)
PASS — `keys().hasOnly` on every user-writable doc; non-admin tool and review updates are limited by `changedOnly` — evidence: firebase/firestore.rules:93, :140, :146, :151, :174, :180, :195, :77-78, :132
BRIEF GAP — SPEC §2.1 "Read: anyone (published only)" vs updates of a draft tool: `tools/{draft}/updates/*` is readable by visitors, by `get` and by collection-group `toolId in [draft]`. Updates carry no `published` field, and the O1 contract says "any update", so this is not a worker FAIL. It leaks draft slugs and changelogs if an admin writes updates before publishing — evidence: firebase/firestore.rules:222-223, :295-297; probes P15a/P15b allowed
BRIEF GAP — vote lifecycle across review delete/re-create: votes under a deleted review are orphaned, and they cannot be withdrawn while the review is gone (P22a denied). After the author re-creates the review (`helpfulCount` 0), the old voter can withdraw and drive `helpfulCount` to −1 (P22b allowed, result −1). That fails `reviewSchema.helpfulCount.nonnegative()`, so the converter drops the review: one voter can hide the author's re-created review. Suggested fix: add `request.resource.data.helpfulCount >= 0` to `isHelpfulCountUpdate`. Neither the brief nor INV-9 asks for it — evidence: firebase/firestore.rules:127-137, packages/schemas/src/review.ts:16
BRIEF GAP — account deletion cannot find the user's own votes. A vote doc is only `{createdAt}` and no collection-group rule exists for `votes` (P16e denied). SPEC §7 "removes the user's own documents" therefore leaves votes (keyed by the deleted uid) and inflated `helpfulCount` on others' reviews. This is a SPEC data-model gap — evidence: firebase/firestore.rules:240-247
BRIEF GAP — value shapes outside INV-10's list are unchecked. A collection's `toolIds` elements are untyped and unbounded (P20 allowed `[1, {…}, 5000-char string]`). `photoUrl`/`authorPhotoUrl` are unbounded strings (P21: 100k chars allowed); `authorPhotoUrl` is on a public review, so it is a payload-size vector. A name padded with whitespace past 40 characters is stored (P19), which matches the O1 contract's "trimmed length". A doc that fails zod parse is dropped, so this only harms the writer's own data or its size — evidence: firebase/firestore.rules:42-44, :148, :102, :182, :187-188
BRIEF GAP — reviews (and so rating updates) are allowed on unpublished tools (P06 allowed), and admins can overwrite `rating` directly (P18 allowed). SPEC is silent on the first and the O1 contract allows the second; the worker disclosed both — evidence: firebase/firestore.rules:220, :229-231

## Hand-back decisions vs stop conditions
PASS — per-tool `reviews.updatedAt` as a field override, not a composite: Firestore rejects single-field composites, and this is not a stop condition — evidence: firebase/firestore.indexes.json:31-39
PASS — added collection-group `reviews.authorUid` ASC: needed for the un-ordered `authorUid ==` collection-group query; within scope — evidence: firebase/firestore.indexes.json:21-30
PASS — admins not constrained on `rating`: matches the O1 contract ("catalogue: admin only"); disclosed as a follow-up — evidence: firebase/firestore.rules:220; probe P18
PASS — a review edit may change `authorName`/`authorPhotoUrl`/`locale`, all validated: the O1 contract fixes only toolId, authorUid, helpfulCount and createdAt as immutable — evidence: firebase/firestore.rules:116-118
PASS — set-again updates for saved, bundleInterest and collections, with timestamps pinned: supports idempotent Notify me (SPEC §10) — evidence: firebase/firestore.rules:266, :274, :283-285
PASS — `get` of a missing tool or bundle is denied, the same as a draft: fail-closed. Server readers use published lists, not `getDoc` of tools — evidence: firebase/firestore.rules:218, :253; app/src/api/server/catalogue.ts:20-21
PASS — admin `bundleInterest` access is `list` only on the group match: this is enough for count queries (SPEC §8) — evidence: firebase/firestore.rules:305-307
PASS — reviews allowed on unpublished tools: SPEC is silent; no new invariant was added; disclosed — evidence: probe P06
No decision hit a stop condition: no invariant was found inexpressible and no oracle contradiction was claimed. The hand-back's `mapfile` gate defect is already fixed on trunk in c0ee6bb, and the oracle step passes with it.

## Not applicable to R1
No app code changed, so there are no writes to check against `reviewBatch.ts`, no app list queries to check for a `published` filter, and no catalogue copy (scope gate → exit 0).

VERDICT: PASS
