**Template:** brief-v1 · **Task:** R1 · **Phase:** 3 · **Model:** opus (verified) · **Base sha:** ef3c37c

# R1 — Firestore security rules and indexes

The app has no server. **These rules are the backend.** Every write path for user data, reviews,
votes and aggregates is enforced only here.

## Read first
1. `~/Repos/ai-explore/prompt/CLAUDE.md` (binding), in particular §Firebase.
2. `~/Repos/ai-explore/prompt/SPEC.md`: §1, §2 and §Invariants 1–12.
3. **The oracle**, which is your definition of done: `firebase/tests/rules/*.test.ts`, written by O1.
   It is `describe.skip('INV-<n>: …')` today.
   - Your only edit there is removing `.skip` from INV-1…12. Never change an assertion.
   - O1's brief (`prompt/overnight/tasks/O1/brief.md` §"The rules contract") states the exact
     contract in prose. Read it.
4. The schemas in `packages/schemas/src/*.ts` for field names and limits (`COLLECTION_ICONS`, `ACCENTS`,
   `COLLECTION_LIMITS`, `REVIEW_LIMITS`, `DISPLAY_NAME_MAX`, `BUNDLE_PERIODS`).
5. The current interim rules in `firebase/firestore.rules`, which only allow public reads. Rewrite the whole file.

## Where you work
- Worktree `~/Repos/ai-explore-wt/R1`, branch `overnight/R1`, with the SLOT given in `.env.slot`.
- Scope: `firebase/firestore.rules`, `firebase/firestore.indexes.json`, and `firebase/tests/rules/**` (un-skip only).
- The hand-back goes to `~/Repos/ai-explore/prompt/overnight/tasks/R1/handback.md`.

## Design requirements
- Use small named functions: `isSignedIn()`, `isAdmin()`, `isOwner(uid)`, `onlyKeys(list)`,
  `unchanged(keys)`, `isServerTime(value)`, and validators per document type. Keep it readable;
  `// INV-n` comments are allowed on the rules that encode an invariant.
- Pair the aggregates with `getAfter()` / `existsAfter()` and `get()` / `exists()`, checking deltas
  in both directions:
  - the review write must see the matching tool `rating` delta;
  - the tool `rating` update must see the matching review create, edit or delete.
  The same applies to votes and `helpfulCount`.
- Deltas are checked against `request.resource.data` versus `resource.data`. `increment()` transforms are
  resolved before rules evaluate.
- **Rules are not filters.** A public list must be provable from the query, through
  `resource.data.published == true` on `list`.
- Admins: `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
- Collection-group matches (`/{path=**}/updates/{id}`, `/{path=**}/bundleInterest/{id}`,
  `/{path=**}/reviews/{id}`) cover every query the app will run:
  - updates: `toolId in [...]` plus `publishedAt` ordering;
  - reviews: `authorUid == uid` for profile and account deletion;
  - bundleInterest: admin counts.
- `firestore.indexes.json` declares composite indexes for:
  - the `updates` collection group on `toolId` ASC, `publishedAt` DESC;
  - the `reviews` collection group on `authorUid` ASC, `updatedAt` DESC;
  - per-tool reviews on `updatedAt` DESC.
  The emulator does not enforce indexes, but production will.

## Acceptance
- [ ] INV-1…12 are un-skipped and green. Run `scripts/test-rules.sh`; the smoke test stays green.
- [ ] No assertion in `firebase/tests/rules/**` changes. The gate's oracle step enforces this.
- [ ] `scripts/gate.sh --full --task R1 --base <base> --expect-pending 18-26` → `GATE PASS`.
- [ ] Keep the public pages working: the library, tool and bundle pages still render in the e2e smoke run.

## Out of scope
App code, seed data, and new invariants. If you believe the oracle is wrong, do not edit it. Hand
back with the test name and your reasoning.

## Stop conditions (do not guess)
- An invariant cannot be expressed in Firestore rules. Say which one and why.
- An oracle test contradicts SPEC or another oracle test.

## Boundaries
No push, no deploy (`firebase deploy` is forbidden; emulators only), no new dependencies, named `git add`.
Commit as `feat(firebase): security rules and indexes [R1]` with a why-body and
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Hand-back
Use the template. List each INV with its test count and the rule function that enforces it.
