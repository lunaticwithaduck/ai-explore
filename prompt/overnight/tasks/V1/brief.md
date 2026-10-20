**Template:** brief-v1 · **Task:** V1 · **Phase:** 5 · **Model:** opus (verified) · **Base sha:** <set at spawn>

# V1 — Reviews, live rating summary, and helpful votes

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/reviews/**`, `app/src/api/endpoints/reviews.ts`, `app/src/messages/{en,bg}/reviews.json`, `artifacts/screens/V1-*`.
Stub you replace: `features/reviews/components/ReviewsSection/ReviewsSection.tsx` (`{ toolId }`). T1 renders it on the tool page.

## Owns
The review parts of INV-20 (`app/e2e/inv-20-user.spec.ts`). E5 un-fixmes it.

## Security contract
The rules (R1, on trunk) accept only paired batches; read `firebase/firestore.rules` and O1's brief.
**All** writes go through `features/reviews/utils/reviewBatch.ts`, the one module CLAUDE.md names:
- **`createReview(db, toolId, user, { rating, body, locale })`:** writes the review (doc id = uid, exact
  fields, `helpfulCount: 0`, `serverTimestamp()` for both times) plus
  `tools/{toolId}`: `{ 'rating.count': increment(1), 'rating.sum': increment(rating) }`.
- **`updateReview(db, toolId, uid, previousRating, { rating, body })`:** updates rating, body and
  `updatedAt`, plus a `rating.sum` delta only when the rating changed.
- **`deleteReview(db, toolId, uid, rating)`:** deletes the review, plus count −1 and sum −rating.
- **`voteHelpful` / `unvoteHelpful`:** the vote doc (id = voter uid, `{ createdAt }`) plus `helpfulCount ±1`.

**Exemplar:** `firebase/tests/rules/batches.ts` builds exactly the batches the rules accept (140 rules tests pass against them). Mirror those shapes in the app SDK. When an edit leaves the rating unchanged, omit the tool update entirely.

Unit-test the delta maths with the batch mocked (e.g. `previousRating === rating` adds no tool update).
U3 reuses `deleteReview` for account deletion, so keep its signature stable.

## UI
- **Live rating summary.** It must be the **only** element on the page with `tool.ratingAverage` and
  `tool.ratingCount`. It subscribes realtime to `tools/{toolId}` (`rating`).
  - `count > 0`: show `StarRating`, the average via `averageRating` + `formatAverage` in `tool.ratingAverage`,
    and the count in `tool.ratingCount`.
  - `count == 0`: show the "No reviews yet" text and render **neither** id.
- **The list** (`reviews.section`): items `reviews.item` with `data-id=<authorUid>`, showing author,
  avatar, stars, date and body. Sort by newest or most helpful. Read realtime.
- **Helpful** (`reviews.helpful`, `aria-pressed`, count): disabled on your own review. Signed out, it
  goes to sign-in with `?next=`.
- **Form** (`reviews.form`), signed in and with no own review yet:
  - `RatingInput` inside `reviews.ratingInput` (options `data-id` 1–5);
  - `Textarea` `reviews.bodyInput` (at most 2000 characters, with a counter);
  - `reviews.submit`.
  Use react-hook-form + zod. The rating is required.
- **Own review:** shown first with `reviews.edit`, which opens the same form prefilled; submit updates.
  Also `reviews.delete`, which opens a confirm Dialog with `reviews.confirmDelete`.
- Signed out, show a call to sign in to review.
- Get the user from `useCurrentUser()` (A1) and the locale from `useLocale()`.

## Acceptance
- [ ] Run INV-20's review steps locally (temporarily un-fixme it in the worktree, without committing
      that; the save and collection steps may still fail until U1 merges) and confirm the review part passes.
- [ ] `scripts/gate.sh --full --task V1 --base <base> --expect-pending <given at spawn>` → `GATE PASS`.
- [ ] Screenshots: the reviews section at 375 and 1280, signed in with your own review.
