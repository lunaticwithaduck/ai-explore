**Template:** brief-v1 · **Task:** U3 · **Phase:** 5 · **Model:** opus (verified) · **Base sha:** <set at spawn>

# U3 — Delete account

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/account/delete/**` and `app/src/messages/{en,bg}/account.json` (add keys under `delete.*` only), `artifacts/screens/U3-*`.

## Goal (SPEC §7)
`DeleteAccountSection` shows a danger button (`account.deleteAccount`), which opens a confirm Dialog
(`account.confirmDelete`) requiring the user to type their email. On confirm, delete in this order:

1. Every own review, via `deleteReview` from `@/features/reviews/utils/reviewBatch`. Find them with the
   collection group `reviews` where `authorUid == uid`. This keeps the aggregates correct.
2. Own helpful votes are left in place; there is no rule path to find them cheaply. Note this as a follow-up.
3. `saved/*`, `collections/*`, `bundleInterest/*`, then `users/{uid}`.
4. `deleteUser(auth.currentUser)`.

If step 4 throws `auth/requires-recent-login`, prompt for the password, call `reauthenticateWithCredential`
and retry. Then sign out to the library.

Show progress and handle errors through `errors.*`.

## Acceptance
- [ ] Unit tests: the order of operations (with mocks), and that the reauth path retries once.
- [ ] Manual e2e (do not commit a spec):
  1. Sign up and write a review on chatgpt.
  2. Delete the account.
  3. The chatgpt rating returns to its prior value, and signing in with the old credentials fails.
  Record how you ran it in the hand-back.
- [ ] `scripts/gate.sh --full --task U3 --base <base> --expect-pending <given at spawn>` → `GATE PASS`.
