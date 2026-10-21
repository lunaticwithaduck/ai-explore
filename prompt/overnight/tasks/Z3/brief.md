**Template:** brief-v1 · **Task:** Z3 · **Phase:** 6 · **Model:** sonnet · **Base sha:** d95d057

# Z3 — Release-audit fixes (Z1 "fix tonight", except M1 and M5)

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` (binding, including the rules at its end) and
`~/Repos/ai-explore/artifacts/qa/Z1-report.md`. Item IDs refer to that report.

R3 runs in parallel and owns `firebase/firestore.rules`, `features/reviews/utils/reviewAuthor.ts`, `features/reviews/components/**`,
`reviews.json` and `features/auth/utils/profileSeed.ts`. Do not touch those files.

## Items
1. **M2.** Server-side Firestore reads in `app/src/api/server/*.ts` get a timeout, about 4 s via `Promise.race`, that throws a
   typed `unavailable` error.
   - The shell's categories read degrades to an empty category list. The pages already render the error boundary from H1a.
   - Prove it: pause Firestore (`kill -STOP` the emulator's java PID, then `-CONT` it) and show that `/` and `/sign-in`
     respond within 6 s.
2. **M3.** With `prefs.productUpdates === false`, the bell shows no badge, and the panel says updates are turned off, with a
   link to settings. INV-21 must stay green; new users default to `true`.
3. **M4.** Sign-out waits for pending writes: `waitForPendingWrites(clientDb())` with about a 5 s timeout. While it waits, the
   menu shows a "saving…" state. On timeout it signs out anyway and shows a translated warning.
4. **m1.** The delete-review confirm button is disabled while the delete runs (single-flight), so there is no false permission
   error and no negative count. The button lives in V1's `DeleteReviewDialog`. If that file is inside
   `features/reviews/components/**`, **skip this item** and list it in the hand-back (R3 owns that folder).
5. **m2.**
   - After a successful **create**, the admin tool form navigates to the edit page for that slug.
   - Slug uniqueness is checked against the server (`getDoc`) before create.
   - Create must never overwrite an existing tool: use a transaction that fails if the doc exists.
6. **m4.** A Google display name longer than 60 characters is cut without splitting an emoji (`Intl.Segmenter` graphemes,
   at most 60 UTF-16 units). This goes in the auth sign-in path (`features/auth/utils`), **not** `profileSeed.ts`. If the cut
   only happens in `profileSeed.ts`, skip this item and report it.
7. **Bulgarian copy pass** (Z1 minors), for every namespace in scope:
   - ICU plurals for counts: `{count, plural, one {…} other {…}}` for "1 инструмент", trial days and review counts;
   - the polite "Вие" form throughout;
   - "Отзиви", not "Ревюта", in `account.json` (not the `delete.*` keys);
   - "ИИ" consistently.
   Update the matching `t()` calls to pass `count`. en and bg keys stay identical (INV-15).
8. **Small follow-ups:** add `routes.adminUpdate(toolId, updateId)` to `app/src/config/routes.ts` and use it in admin, and remove
   the unused `admin.updates.hint` keys.

## Scope
- `app/src/api/server/**`, `app/src/shell/**`, `app/src/features/notifications/**`;
- `app/src/features/auth/hooks/useSignOut.ts` (and its test), `app/src/features/auth/utils/**` except `profileSeed.ts`;
- `app/src/features/admin/**`, `app/src/app/[locale]/(admin)/**`, `app/src/config/routes.ts`;
- `app/src/features/{catalogue,bundles,library,my-library,compare,bundle-interest,account/profile,account/components}/**`;
- `app/src/messages/{en,bg}/*.json` except `reviews.json`;
- `artifacts/screens/Z3-*`.

## Acceptance
- [ ] Each item is fixed or skipped with a reason in the hand-back (`~/Repos/ai-explore/prompt/overnight/tasks/Z3/handback.md`).
- [ ] `scripts/gate.sh --full --task Z3 --base d95d057` → `GATE PASS`, with the pending list empty.
