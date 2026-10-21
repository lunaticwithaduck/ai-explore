# V1 hand-back · round 1

**Head sha:** a744b22 (branch `overnight/V1`, base 60e02c9) · **Gate:** `scripts/gate.sh --full --task V1 --base 60e02c9 --expect-pending 20-22,24-25` → exit 0, `GATE PASS` (biome, conventions, node-tests, typecheck, test, rules, e2e, scope, oracle, pending = 20 21 22 24 25)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| `createReview` writes the exact review fields (doc id = uid, `helpfulCount: 0`, `serverTimestamp()` ×2) and `rating.count +1` / `rating.sum +rating` in one batch | `app/src/features/reviews/utils/reviewBatch.ts:49` | `pnpm --filter @ai-explore/app exec vitest run src/features/reviews` | 0 |
| `updateReview` updates `rating, body, updatedAt` and adds a `rating.sum` delta only when the rating changed (unit test: `previousRating === rating` → one update only) | `reviewBatch.ts:72`, `reviewBatch.test.ts` | same | 0 |
| `deleteReview(db, toolId, uid, rating)`: delete + count −1, sum −rating (signature kept for U3) | `reviewBatch.ts:86` | same | 0 |
| `voteHelpful` / `unvoteHelpful`: vote doc `{ createdAt }` id = voter uid, plus `helpfulCount ±1` | `reviewBatch.ts:98`, `:110` | same | 0 |
| Realtime reads through RTK Query (`toolRating`, `toolReviews`, `helpfulVote`), parsed with `parseDoc`/`parseDocs` + schemas | `app/src/api/endpoints/reviews.ts:85-129` | `pnpm typecheck` | 0 |
| Live summary is the only `tool.ratingAverage` / `tool.ratingCount`; count 0 shows "No reviews yet" and neither id | `components/RatingSummary/RatingSummary.tsx:15-47`, `RatingSummary.test.tsx` | vitest (above) | 0 |
| List `reviews.section`, items `reviews.item` + `data-id=authorUid`, sort newest / most helpful, own review first with `reviews.edit` / `reviews.delete` → Dialog `reviews.confirmDelete` | `ReviewsSection.tsx:40`, `ReviewItem.tsx:26`, `OwnReviewActions.tsx:26`, `DeleteReviewDialog.tsx:29,44`, `ReviewsSection.test.tsx` | vitest (above) | 0 |
| Form (react-hook-form + zod): `reviews.form`, `RatingInput` = `reviews.ratingInput`, `reviews.bodyInput` (≤ 2000, counter), `reviews.submit`; rating required | `components/ReviewForm/ReviewForm.tsx:48,70,100,118`, `config/schemas.ts` | vitest (above) | 0 |
| Helpful: `aria-pressed` + count, disabled on own review, signed-out → `/sign-in?next=` | `components/HelpfulButton/HelpfulButton.tsx:20-58` | vitest (above) | 0 |
| INV-20 review steps pass locally (INV-20 temporarily un-fixme'd, not committed): review part green on mobile + desktop; the full spec fails only at `my-library-save-button` (U1 stub) | `app/e2e/inv-20-user.spec.ts:42-71` | `scripts/emulators-exec.sh "scripts/seed.sh && cd app && pnpm exec playwright test e2e/<review-steps copy> e2e/inv-20-user.spec.ts"` | review steps 2 passed; full INV-20 2 failed at line 17 (save button not found) |
| Screenshots at 375 and 1280, signed in with own review (+ a helpful vote pressed) | `artifacts/screens/V1-tool-reviews-375.png`, `V1-tool-reviews-1280.png` | temp Playwright script in emulators, then deleted | 0 |
| axe (serious/critical and all) on the section: visitor, form with error, own review, delete dialog | — | temp AxeBuilder spec scoped to `reviews.section` / `[role=dialog]`, then deleted | 0 |

## Decisions I made that the brief didn't dictate
- **Writes live in feature hooks, not RTK mutations.** `api/endpoints/reviews.ts` is the shared layer and the linter forbids it importing `features/reviews/utils/reviewBatch.ts`. So reads are RTK Query endpoints there, and writes go component → `useReviewWrites` / `useHelpfulVote` → `useBatchAction` (`firestoreCall` + `clientDb()`) → `reviewBatch`. No component touches Firestore. Realtime listeners make tag invalidation unnecessary.
- **Write state sits in `ReviewComposer`,** which stays mounted. With latency compensation, the own review appears (or disappears on delete) before the commit resolves. A rejected batch rolls back and its translated `errors.<code>` still shows.
- **Edit/delete are disabled while a write is pending,** so an edit cannot race an unacknowledged create.
- **Author name resolution** (`utils/reviewAuthor.ts`): profile `displayName` → auth `displayName` → email local part → `reviews.anonymous`, clipped to 60 (rules `isText(1, 60)`). Photo: profile then auth `photoUrl`, kept only if `z.url()` passes and ≤ 2048 chars, so the doc never fails `reviewSchema` on read.
- **Body is trimmed** by the zod schema, and the empty body that the rules allow is accepted. The label shows "Optional".
- **Sorting is client-side** over one realtime subscription to the whole `reviews` subcollection. Helpful sort breaks ties by newest. The own review is always first, outside the sort.
- **Signed-out Helpful is a `Link`** (Button asChild) to `signInHref(pathname)` without `aria-pressed`, because `aria-pressed` is not allowed on a link (axe). Signed in, it is a button with `aria-pressed`.
- **`reviews.section` is on the outer `<section>` card,** which holds the summary, composer and list.
- **The summary's big number is `aria-hidden`.** The `StarRating` beside it carries "Rated 4.3 out of 5", so screen readers hear the average once.
- An "Edited" marker shows when `updatedAt − createdAt > 60 s`.

## Slots
- Filled: `ReviewsSection` (`{ toolId }`, export name unchanged).
- Consumed while still stubbed: none. `SaveToolButton` / `AddToCollectionMenu` (U1) sit beside it on the page but are not consumed.

## Not done, and why
- INV-20 stays `fixme`: its save/collection steps need U1, and E5 owns un-fixme'ing it. The review steps are verified locally (above).

## For the manager
- **U3:** `deleteReview(db, toolId, uid, rating)` from `@/features/reviews/utils/reviewBatch`. Find the reviews with a collection-group query on `authorUid`; the index is already in `firestore.indexes.json`.
- **Follow-up (rules, not fixable in V1 scope): orphaned votes.** Deleting a review leaves `reviews/{uid}/votes/*`, because only the voter may delete a vote. If the author reviews again, `helpfulCount` restarts at 0 but old voters still see Helpful pressed. Unvoting would then take `helpfulCount` to −1, which the rules deny. Options: let the review author delete votes under their own review in the delete batch, or key votes by a review generation.
- **Follow-up:** `ToolHeader` (T1) still shows the ISR rating, so after a review it lags the live summary until revalidation. The reviews summary is the live source of truth, as the brief intends.
- **Follow-up:** `toolReviews` reads the whole subcollection, with no limit. That is fine for the seed sizes. Paginate with `orderBy` + `limit` if review counts grow.
- **Seam:** a stray `ai-explore-wt/artifacts/screens/B1-library-empty-1280.png` sits outside any worktree (dated 01:04, not mine). A relative screenshot path from `app/` resolves there; my two files were moved into the V1 worktree.
- No new primitive, token or dependency was needed. No `next start` or emulator is left running on slot 2.
