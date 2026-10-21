# U3 verdict · rounds 1 + 2

**Verifier:** verifier-v1 · **Worktree:** `~/Repos/ai-explore-wt/U3` · **Base:** ce533a1 · **Head:** e77cd01 · **Slot:** 4

`V` = `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/verify-u3`.
Probes ran with `SLOT=4 scripts/emulators-exec.sh "V/run.sh <probe>"`. That command seeds, starts `next start -p 3004` on the gate's slot-4 build, and kills only that PID.
- Probe exits: p1-race 0, p2-fallback 1, p3-upfront 1, p4-crossuser 0, p5-twotabs 0 (reports NOTEs only).
- Logs are `V/p1.log` … `V/p5.log`. Screenshots are in `V/shots/`.

## Blind pass (SPEC §2.2, §2.3, §7, INV-4/6/15/25 + prompt/CLAUDE.md)

1. Settings offers account deletion.
2. Deletion removes the user's own documents on the client: `users/{uid}`, `saved`, `collections`, `bundleInterest`.
   - `subscriptions` cannot be deleted by a client (INV-4).
   - The user's own helpful-vote docs are their own data too.
3. Each own review is removed with the matching aggregate decrement, through `reviewBatch` (INV-6).
4. The auth user is deleted last.
5. No raw error strings reach the screen.
6. The en and bg catalogues have identical keys (INV-15).
7. The settings page passes axe (INV-25).
8. After deletion, no profile document exists again.

The brief covers 1–4 and leaves out `subscriptions` and votes (both acknowledged). It does not say what the user is told when the step-4 reauth is abandoned, and it does not cover multi-tab re-creation (see below).

## Criteria

PASS — Brief: unit test of the order: reviews → saved/collections/bundleInterest → `users/{uid}` → `deleteUser` — evidence: `app/src/features/account/delete/utils/deleteAccount.test.ts:99`, `deleteAccount.ts:77-85`, `pnpm exec vitest run src/features/account src/features/auth` (in `app/`) → exit 0 (11 files, 97 tests)

PASS — Brief: the reauth path retries `deleteUser` exactly once, does not retry a second time, and does not reauth on other errors — evidence: `deleteAccount.test.ts:143`, `:152`, `:160`, `deleteAccount.ts:60-68`, same vitest command → exit 0

PASS — Brief: manual e2e — evidence: `V/p1.log`, `run.sh p1-race.mjs` → exit 0
- Sign up, then review chatgpt (1★) and midjourney (3★).
- chatgpt went {2,9} → {3,10} → {2,9}; midjourney went {2,9} → {3,12} → {2,9}.
- The tool page shows 4.5 again.
- Old credentials fail: REST returns `EMAIL_NOT_FOUND`, and the UI shows `auth-error`: "That email and password don't match…".

PASS — Brief: full gate, printed pending empty — evidence: `scripts/gate.sh --full --task U3 --base ce533a1 --log V/gates.log` → exit 0
- GATE PASS, with `pending:` empty.
- e2e 20/20 (INV-20/21/23/25 on mobile and desktop), rules 146/146, scope 0, oracle 0.

PASS — (1) Every own review is removed through `deleteReview`, and the deltas are exact — evidence: `deleteAccount.ts:43-49`, `features/reviews/utils/reviewBatch.ts:86-96`, `firebase/firestore.rules:291-292` (the server checks −1/−r against the stored doc), `V/p1.log` (two tools restored at 300/3000/8000 ms), `V/p3.log` [google] ({4,15} → {3,11}, exactly −1/−4) → exit 0/1 (p3's failure is a different check)

PASS — (1) `saved`, `collections`, `bundleInterest` and `users/{uid}` are all gone before `deleteUser` returns — evidence: `V/p1.log` [3000]/[8000]
- While `accounts:delete` was held: no reviews, library 0/0/0, no profile, auth user still alive.
- After release, the auth user is gone (`accounts:lookup` is empty).
- Exit 0.

PASS — (1) For an old session, reauth happens up front, before anything is deleted, and Cancel keeps everything — evidence: `deleteAccount.ts:77`, `V/p3.log` [upfront] (account, profile, review and library intact after Cancel) → exit 1 (that failure is the separate [upfront-escape] check)

FAIL — (1) The step-4 fallback leaves data deleted and the account alive, without telling the user — evidence: `V/p2.log` [fallback-cancel], `V/shots/fallback-prompt-1280.png`, `V/shots/fallback-after-cancel-1280.png`, `run.sh p2-fallback.mjs` → exit 1
- **Reproduction:** the first `accounts:delete` is answered with `CREDENTIAL_TOO_OLD_LOGIN_AGAIN`, which the SDK maps to `auth/requires-recent-login`.
- **What the user sees:** the reauth prompt arrives after steps 1–3 are already done. Its copy is the same as the up-front prompt ("For your security, enter your password to delete your account.").
- **After Cancel, Escape or X:** the dialog closes in silence, because `CANCELLED` maps to `error: null` (`useDeleteAccount.ts:67`, `:96-100`).
- **Resulting state:** the auth user is alive; reviews, library and profile are gone. The four other settings sections stay a skeleton for good, because the profile is null and is not re-created.
- **How it is reached:** the client clock lags the server by more than 1 min, or steps 1–3 take more than 1 min. The up-front check is 4 min by the client clock (`config/constants.ts:19`, `deleteAccount.ts:35-38`); Firebase's limit is 5 min.
- The hand-back says "never one without the other". That is true only for the up-front path.
- Reopening the dialog and confirming again does finish the deletion (p2 second attempt PASS).

PASS — (2) `users/{uid}` is never re-created in a single tab — evidence: `useEnsureProfile.ts:25-40`; a 50 ms owner-REST poller recorded the profile trace `[true,false]`, then held. Covered cases:
- `accounts:delete` delays of 300, 3000 and 8000 ms (`V/p1.log`);
- the fallback reauth wait (`V/p2.log`);
- up-front password reauth and Google reauth (`V/p3.log`).
- Exit 0/1/1 (the failures are other checks).

PASS — (2) First sign-in and sign-up still create a profile — evidence:
- sign-up (`V/p1.log`);
- first Google sign-in (`V/p3.log` [google]);
- an Auth-only user's first sign-in, by soft navigation in the same tab, after another user's deletion (`V/p4.log`) → exit 0;
- INV-20/21/23 green in the gate.

BRIEF GAP — (2) Multi-tab: a second tab opened while `accounts:delete` is in flight re-creates `users/{uid}`, and the document is left orphaned once the auth user is gone — evidence: `V/p5.log`, trace `[true,false,true]`, final `{authAlive:false, profileExists:true}`, `run.sh p5-twotabs.mjs` → exit 0
- The hold is per-tab module state (`useEnsureProfile.ts:8`), and the new tab has not "seen" the profile.
- This is outside the brief and needs a design follow-up, for example auto-creating only for newly created accounts.

PASS — (3) `holdProfileCreation` is released on success, error and cancel — evidence:
- `useDeleteAccount.ts:56-70` (`try`/`finally`); `cancel()` rejects the pending reauth (`:96-98`), so the `finally` runs.
- `DeleteAccountSection.test.tsx:91`, `:155`; vitest → exit 0.
- While a reauth fails and the prompt stays open, the hold is kept by design, because the deletion is still running.
- Note: the hold is never released if the dialog unmounts with a reauth still pending (that promise never settles). This is harmless, because it is keyed by that uid and `seenFor` already blocks re-creation.

PASS — (3) The hold cannot leak across users — evidence:
- It is keyed by uid (`useEnsureProfile.ts:8-15`).
- `V/p4.log`: in the same tab, with module state kept (window marker survived), user C got a profile after A was deleted, and user D got one after C cancelled a deletion → exit 0.

PASS — (4) Password reauth — evidence: `reauth.ts:16-19` (the email comes from `user.email`, not from input), `ReauthForm.tsx:35`, `:67` (an empty password is blocked), `V/p2.log`, `V/p3.log` → exit 1/1 (the failures are other checks)
- A wrong password shows the translated `wrongPassword` message, and `deleteUser` is not retried (1 call).
- The right password gives exactly one retry (2 calls).

PASS — (4) Google reauth — evidence: `reauth.ts:11-14`, `:21`, `V/p3.log` [google]
- A Google-only user gets "Continue with Google" and no password field.
- Reauth in the popup with the same account completes the deletion.
- A different Google account (`auth/user-mismatch`) deletes nothing.
- Minor: the copy shown for that case is "That password isn't right. Try again." (`deleteErrors.ts:18`), which is wrong for a Google user.

PASS — (4) The type-your-email confirmation cannot be bypassed in the UI — evidence: `ConfirmDeleteForm.tsx:30-31`, `:45-48`, `:90`, `DeleteAccountDialog.tsx:59`, `DeleteAccountSection.test.tsx:68`, `V/p1.log`, `V/p3.log`
- Confirm stays disabled until the typed text matches the email, ignoring case and surrounding spaces.
- `start` can only be reached through `onConfirm`.
- The typed value is cleared on close.
- The real security boundary is still the rules plus Firebase's own recent-login check.

FAIL — (4)/(5) Closing the dialog while a reauth request is pending leaves the hook stuck in `running`, so the Delete account button no longer opens the dialog until the page is reloaded — evidence: `V/p3.log` [upfront-escape], `V/p2.log` [fallback-escape], `V/shots/upfront-escape-stuck-1280.png`, `run.sh p3-upfront.mjs` / `p2-fallback.mjs` → exit 1
- **Trigger:** Escape, an overlay click or X. These are blocked only while the phase is `running` (`DeleteAccountDialog.tsx:24-35`), not while `state.pending` is true.
- **Cause:** `cancel()` rejects the deletion. When `reauthenticateUser` resolves later, `reauthenticate()` still calls `showStep(lastStep)`, with no check that the request is still current (`useDeleteAccount.ts:89-91`).
- **Effect:** after that, `changeOpen` ignores every open request (`DeleteAccountDialog.tsx:24-25`).
- On the fallback path, data is already deleted and the account stays alive.

PASS — (5) The dialog stays mounted through the whole flow — evidence: `SettingsView.tsx:53-62` (the danger section is a sibling, shown when `user && profile !== undefined`), `V/p1.log` [3000]/[8000] → exit 0
- The dialog is visible with `aria-current` on step `account` while `accounts:delete` is held.
- Escape and X do not dismiss it while it is running.

PASS — (5) The other settings sections behave as before — evidence: `SettingsView.tsx:25-52` (still gated on `user && profile`), `V/p3.log` [upfront] (the display-name input renders after Cancel), INV-23 and INV-25 (settings axe) green in the gate
- One change: the danger section now also shows while the profile is `null`.

PASS — (6) No raw Firebase error text reaches the UI — evidence: `deleteErrors.ts:13-32` (keys only), `api/errors.ts:29-34`, `useDeleteErrorMessage.ts:9-11` (rendered through `t()`), `deleteErrors.test.ts`
- Body and alert text never matched `/Firebase|auth\/|permission-denied|CREDENTIAL_TOO_OLD|INVALID_|EMAIL_NOT_FOUND/` in p1, p2 or p3.

PASS — (7) Conventions and en/bg parity — evidence:
- The gate's biome, conventions, typecheck and scope steps → exit 0.
- en and bg each have the same 27 `delete.*` keys, none empty, with matching placeholders (node check → exit 0). The message diff only adds keys under `delete.*`.
- No comments, `interface`, default exports, `style={}`, hex or raw HTML in the delete feature (grep → exit 1, no hits). The largest non-test file is 103 lines.

PASS — Diff review — evidence: `git diff ce533a1..e77cd01`
- No rules changes.
- Review writes go only through `deleteReview`.
- The rating delta is read from the stored doc and checked by the server (`firestore.rules:291-292`).
- The collection-group index exists (`firebase/firestore.indexes.json`, `fieldOverrides` reviews.authorUid `COLLECTION_GROUP`).
- No `published` filter is needed, because this is not a public list query.

BRIEF GAP — Votes are left behind — evidence: `firebase/firestore.rules:301`
- Votes that others gave on the deleted user's reviews (`tools/{slug}/reviews/{uid}/votes/*`) are left without a parent. Only the voter may delete a vote.
- The user's own helpful votes and `subscriptions` are also left in place (acknowledged in the hand-back).

PASS — Hand-back decisions checked against the stop conditions:
- The up-front recent-sign-in check, Google popup reauth, the `delete/{components,hooks,utils,config}` layout, the reuse of `auth/components` `AuthField`/`AuthAlert`, and the Firestore calls in `delete/utils` all stay inside scope. The last follows the precedent in `features/reviews/hooks/useReviewWrites.ts`.
- `holdProfileCreation` is in `useEnsureProfile.ts`, which the round-2 extension covers.
- The `useEnsureProfile.test.ts` scope line is in the manager's `scope.txt` and is acknowledged by the coordinator.
- Inaccurate claim: "never one without the other" (see the fallback FAIL above).

PASS — Worktree untouched — evidence: `git status --porcelain` → empty, exit 0; HEAD is e77cd01; no listener left on 3004/8120/9139.

## Fixes needed (small, both in `useDeleteAccount.ts` / the delete components)

1. **Late reauth result.** In `reauthenticate`, after the `await`, return early when `request.current !== pending`. Also block Escape, outside clicks and X while `state.phase === 'reauth' && state.pending`.
2. **Fallback reauth copy and cancel.**
   - When the reauth is requested after the profile step (`lastStep === 'account'`), show copy that says reviews, library and settings are already deleted and only the sign-in is left.
   - After cancelling there, keep a persistent alert in the danger section that tells the user to finish deleting the account, instead of returning silently to idle.
   - Optional: map `auth/user-mismatch` to a message that fits Google users.

VERDICT: FAIL

## Round 3

**Verifier:** verifier-v1 · **Worktree:** `~/Repos/ai-explore-wt/U3` · **Base:** 6fc7145 · **Head:** 55f9e04 · **Slot:** 4 · **Scope:** the two round-2 FAIL items, the Google wrong-account message, regressions, conventions and parity.

`R` = `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/verify-u3-r3`. The probes are my own adaptations of round 2's p1–p5 to the new UI (the password is now in the confirm dialog), plus p6 for axe. Each ran with `SLOT=4 scripts/emulators-exec.sh "R/run.sh <probe>"`, which seeds, starts `next start -p 3004` on the gate's slot-4 build, and kills only that PID.
- Probe exits:
  - p1-race-r3 → 0 (62 PASS)
  - p2-fallback-r3 → 0 (54 PASS)
  - p2b-bg-r3 → 0 (7 PASS + NOTEs)
  - p3-confirm-r3 → 0 (53 PASS)
  - p4-crossuser-r3 + p5-twotabs-r3 → 0 (9 PASS + NOTEs)
  - p6-axe-r3 → 0 (10 PASS)
- Logs are `R/p1.log`, `R/p2.log`, `R/p2b.log`, `R/p3.log`, `R/p45.log` and `R/p6.log`. Screenshots are in `R/shots/`.
- The fallback is simulated as before: the first `accounts:delete` is answered with `CREDENTIAL_TOO_OLD_LOGIN_AGAIN`, and later ones pass through.

### FAIL 1: reauthentication order and the step-4 fallback

PASS — Reauthentication happens before any deletion, for both password and Google users — evidence: `useDeleteAccount.ts:85-113`, `ConfirmDeleteForm.tsx:44`, `:66-75`, `DeleteAccountSection.test.tsx:92`, `:103`, `:114`, vitest → exit 0
- `confirm` → `reauthenticateUser` runs first; `run()` is reached only after it succeeds. `deleteAccount.ts:63-77` no longer has the client-clock heuristic.
- The unit test checks the order: `reauth` → `delete` → `signOut` → `replace`.
- `R/p3.log` [pw-fresh] and [pw-old] (6-minute clock skew), with the reauth request held for 2.5 s:
  - At 1.2 s the account, profile, review and library (2/1/1) are all intact.
  - A wrong password deletes nothing.
  - Recorded request order: `reauth,reauth,fsWrite…,authDelete`.
- `R/p3.log` [google]: while the popup is open, nothing is deleted.
- `R/p1.log` (300, 2500 and 8000 ms): `reauth` is the first request, before every Firestore write → exit 0.

PASS — When requires-recent-login comes after the data is deleted, the prompt says the data is already gone — evidence: `DeleteAccountDialog.tsx:29`, `:50-51`, `FinishDeleteForm.tsx:49`, `messages/{en,bg}/account.json:86-93`, `R/p2.log` [fb-ok] → exit 0
- When the prompt appears, the auth user is alive and reviews, library and profile are gone.
- The prompt reads "Finish deleting your account | Your reviews, library and settings are already deleted. Only your sign-in is left."
- A wrong password shows the translated message and makes no retry (1 `accounts:delete` call).
- The right password makes exactly 2 calls. The rating goes back to exactly {2,9}, and the profile trace is `[true,false]`.
- The Bulgarian copy is correct (`R/p2b.log` [fb-bg]), and so is the Google copy (`R/p3.log` [google-fallback]).

PASS — Cancelling leaves a persistent, translated alert whose "Delete sign-in" retry works — evidence: `useDeleteAccount.ts:71-72`, `DeleteAccountSection.tsx:18-25`, `SignInRemainsAlert.tsx:15-28`, `DeleteAccountSection.test.tsx:180`, `R/p2.log`, `R/p2b.log`, `R/p3.log` → exit 0
- [fb-cancel]:
  - Cancel closes the dialog and leaves an alert: "Your account still exists | Your reviews, library and settings were deleted, but your sign-in wasn't… | Delete sign-in".
  - The alert is still there after 5 s, and after the main dialog is opened and cancelled.
  - X on the idle finish prompt keeps the alert.
  - A wrong password on the retry shows the translated message.
  - The retry deletes the auth user, restores the rating exactly, and leaves the profile trace at `[true,false]`.
- [fb-escape-idle] and [fb-x-idle]: Escape or X on the idle prompt also leaves the alert.
- [fb-bg]: the alert and the `wrongPassword` message are in Bulgarian, and the retry finishes.
- [google-fallback]: alert → Delete sign-in → popup with the same account → deletion completes.

PASS — The settings page is not stuck on skeletons — evidence: `SettingsView.tsx:25`, `:49-63`, `R/p2.log` [fb-cancel] `{"sk":0,"signOutVisible":true}`, `R/shots/fb-after-cancel-1280.png`, `R/shots/remains-375.png` → exit 0
- [fb-*-idle] and [fb-bg] also show 0 skeletons.
- The danger section keeps its state through the profile → null change, because the alert renders after the profile is deleted.

NOTE (not a FAIL) — The alert lives in memory and does not survive a reload
- After a full navigation or reload, the alert is gone and `useEnsureProfile` re-creates an empty profile (`R/p2b.log` [fb-softnav]: `profile:true, alert:false`).
- The hand-back discloses this. The result is consistent (a live account with an empty profile), and deletion can simply be run again.
- From reading the code: a different error (for example, network) at the `account` step returns the still-open dialog to the confirm form with that error, and the alert sits behind it. This was not exercised end to end.

### FAIL 2: pending reauth, stale results, and reopening

PASS — Dismissal is blocked while any reauth or delete step is pending — evidence: `useDeleteAccount.ts:139`, `DeleteAccountDialog.tsx:31-42`, `ConfirmDeleteForm.tsx:84`, `FinishDeleteForm.tsx:65`, `DeleteAccountSection.test.tsx:127`, `:143` → exit 0
- In every case below the dialog stayed open after Escape, an outside click and X, and Cancel was disabled:
  - wrong- and right-password reauth held for 2.5 s (`R/p3.log` [pw-fresh], [pw-old]);
  - Google popup open (`R/p3.log` [google]);
  - finish-prompt reauth held for 3 s, with a right and with a wrong password (`R/p2.log` [fb-pending], [fb-pending-wrong]);
  - the running step (`R/p1.log` [2500], [8000]).

PASS — Stale reauth results are ignored — evidence: `useDeleteAccount.ts:92-93`, `:98`, `:103`, `cancel` `:131-137`, `useDeleteAccount.test.tsx:57`, `:76`, vitest → exit 0
- `:57`: an up-front reauth that resolves after a cancel does not call `deleteAccount`, and the phase is idle.
- `:76`: a late finish reauth after the fallback was cancelled leaves `deleteAccount` at 1 call. `signInRemains` is true and there is no sign-out.
- From reading the code, both tests fail without the guard at `:103`, because `run()` would be called.
- Through the UI this path can no longer be reached, because dismissal is blocked while pending.

PASS — After any cancel, the Delete account button works without a reload — evidence: `DeleteAccountSection.test.tsx:205`, `R/p3.log`, `R/p2.log` → exit 0
- [pw-*] (`R/p3.log`):
  - The dialog reopens after Cancel, Escape and X, with the email and password cleared.
  - It also reopens after a delayed wrong-password reauth followed by Cancel, with no stale error.
- [google] (`R/p3.log`): closing the popup returns to an idle confirm form, and the dialog reopens after Cancel.
- `R/p2.log`:
  - [fb-cancel] and [fb-pending-wrong]: the main button opens the dialog.
  - [fb-escape-idle] and [fb-x-idle]: the main button re-runs the deletion and finishes it.

### Google wrong-account message, regressions, conventions

PASS — (3) Google wrong-account message — evidence: `deleteErrors.ts:22`, `messages/{en,bg}/account.json:108`, `deleteErrors.test.ts:14`, `R/p3.log` [google], `R/shots/google-mismatch-1280.png` → exit 0
- The alert reads "That's a different Google account. Choose the one you signed in with."
- Nothing is deleted and the account stays alive.

PASS — (4) Deletion order and exact rating restoration — evidence: `deleteAccount.ts:63-77`, `deleteAccount.test.ts:93`, `:130`, `:139`, `:147`, `:163`, `R/p1.log`, `R/p3.log` [google] → exit 0
- At 300, 2500 and 8000 ms, chatgpt went {2,9} → {3,10} → {2,9}, and midjourney went {2,9} → {3,12} → {2,9}.
- While `accounts:delete` is held, the active step is `account`, reviews, library and profile are already gone, and the auth user is alive.
- Old credentials fail: REST returns `EMAIL_NOT_FOUND` and the UI shows `auth-error`. The tool page shows 4.5 again.
- Google: {3,13} → {2,9}, exactly −1/−4.

PASS — (4) `users/{uid}` is not re-created in one tab under a delayed `accounts:delete` — evidence: `useEnsureProfile.ts:25-40` (unchanged), `R/p1.log` → exit 0
- The trace is `[true,false]` at 300, 2500 and 8000 ms, and in every p2/p3 flow.

PASS — (4) New users still get a profile — evidence: `R/p1.log`, `R/p3.log`, `R/p45.log` → exit 0
- sign-up ×3 (`R/p1.log`);
- first Google sign-in ×2 (`R/p3.log`);
- an Auth-only user's first sign-in by soft navigation in the same tab, after another user's deletion and after a cancelled fallback (`R/p45.log`).

PASS — (4) INV-20/21/23/25 green; full gate — evidence: `scripts/gate.sh --full --task U3 --base 6fc7145 --log R/gates.log` → exit 0
- GATE PASS, with `pending:` printed empty (`gates.log:644`).
- e2e 20/20 (`gates.log:611-631`), rules 146/146, scope 0, oracle 0.
- typecheck and unit tests were replayed from the Turbo cache. A fresh `pnpm exec vitest run src/features/account src/features/auth` → exit 0 (12 files, 103 tests).

PASS — (4) axe on the new states — evidence: `R/p6.log` → exit 0
- At 375 and 1280: settings, the confirm dialog, the finish dialog, and settings with the alert all have 0 serious or critical issues once the open animation has finished.
  - A scan taken during the fade-in reports contrast on half-faded text (NOTE only).
- No horizontal overflow at 375.

PASS — (5) Conventions and en/bg parity — evidence:
- The gate's biome, conventions, typecheck and scope steps → exit 0.
- A grep of `delete/**` and `SettingsView.tsx` for comments, `interface`, default exports, `style={}`, hex, raw HTML and arbitrary Tailwind → exit 1 (no hits). The largest non-test file has 144 lines.
- `account.json` en and bg have the same 69 keys, 34 of them `delete.*`, none empty, with matching placeholders (node check → exit 0). The message diff against the base only adds keys under `delete.*`.
- No changes to `packages/`, `firebase/`, `api/`, `reviews/`, `package.json` or the lockfile (`git diff --stat` → empty).
- The commit message follows the convention.

PASS — Hand-back decisions checked against the stop conditions — all stay inside scope, with no new primitive, token or dependency:
- always reauthenticating first (the coordinator's fix);
- the `confirm`/`running`/`finish` phases, and `signInRemains` kept in the hook;
- the new `DeleteSummary`, `FinishDeleteForm` and `SignInRemainsAlert` under `delete/**`;
- removing `RECENT_SIGN_IN_MS`, `hasRecentSignIn` and the `delete.reauth.*` keys, which only ever existed on this branch;
- the `SettingsView` reshape (its line is in `scope.txt`).

BRIEF GAP (unchanged; out of scope per the coordinator) — a second tab opened during an in-flight delete re-creates `users/{uid}` — evidence: `R/p45.log` [two-tabs]
- The trace is `[true,false,true]`, ending with `{authAlive:false, profileExists:true}`.
- Votes and `subscriptions` are still left behind (round-2 BRIEF GAP).

PASS — Worktree untouched — evidence: `git status --porcelain` → empty; HEAD is 55f9e04; no listener on 3004, 8120, 9139 or 9190.

VERDICT: PASS
