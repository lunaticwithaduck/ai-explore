**Template:** brief-v1 · **Task:** R3 · **Phase:** 6 · **Model:** opus · **Base sha:** d95d057

# R3 — Review author fields must come from the author's profile (release audit M1)

## Read first
- `prompt/CLAUDE.md` §Firebase and `artifacts/qa/Z1-report.md` (M1).
- `firebase/firestore.rules`: R1 and R2 rules, verified. Change as little as possible.
- `firebase/tests/rules/*`, especially `batches.ts`, `builders.ts` and the INV-5, 8 and 10 tests.
- `app/src/features/reviews/utils/{reviewBatch,reviewAuthor}.ts`.

## Problem
The rules accept any `authorName` and `authorPhotoUrl` on a review. A user can post as "AI Explore Team ✔", or make every
visitor's browser load a tracker URL. A non-URL photo passes the rules, but the client schema then hides the review while it still
counts in the average.

## Goal
1. **Rules.** On review create and edit, require:
   - `authorName == get(/users/$(uid)).data.displayName`;
   - `authorPhotoUrl == get(/users/$(uid)).data.photoUrl`;
   - a review without a profile is denied.
   For profile create and update, `photoUrl` must be null or an `https://` URL of at most 2048 characters
   (`matches('^https://[^\\s]+$')`).
   Keep every INV-1…12 and R2 test green. If an existing oracle test now conflicts, for example it seeds a review without a
   profile, **stop and report**. Do not edit existing tests.
2. **New tests.** Put them in `firebase/tests/rules/r3-review-author.test.ts`. This is a new file, so the gate allows it.
   Cover:
   - a mismatched name is denied;
   - a mismatched photo is denied;
   - a missing profile is denied;
   - a non-https photo on a profile is denied;
   - an exact profile match is allowed, on create and on edit.
3. **Client.**
   - `reviewAuthor.ts` must take **exactly** the profile's `displayName` and `photoUrl` (no fallbacks, no clipping;
     the profile is already ≤ 60 characters).
   - If the profile is not loaded yet, the review form stays disabled. Use the existing loading state, and show a translated
     message if the profile is missing.
   - Update V1's unit tests accordingly.
   - INV-20 must stay green: sign-up creates the profile before the review.
4. **Profile writers.** Check that `ensureProfile` (A1) and the settings display-name and photo writes already satisfy the
   https rule. If one doesn't (for example a Google photo URL that isn't https), normalise it to null on write. That is a
   one-line fix in `app/src/features/auth/utils/profileSeed.ts` if needed.

## Scope
`firebase/firestore.rules`, `firebase/tests/rules/r3-review-author.test.ts`, `app/src/features/reviews/utils/reviewAuthor.ts`
(and its test), `app/src/features/reviews/components/**` (only for the disabled or missing-profile state),
`app/src/messages/{en,bg}/reviews.json`, `app/src/features/auth/utils/profileSeed.ts` (and its test).

## Acceptance
- [ ] `scripts/test-rules.sh` is all green.
- [ ] `scripts/gate.sh --full --task R3 --base d95d057` → `GATE PASS`, with the pending list empty.
- [ ] The hand-back goes to `~/Repos/ai-explore/prompt/overnight/tasks/R3/handback.md`.
