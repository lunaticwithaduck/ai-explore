# U3 hand-back · round 1

**Head sha:** 853ac38 · **Gate:** `scripts/gate.sh --full --task U3 --base 35f9212 --expect-pending 20-21,25` → exit 0 (GATE PASS)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| Order of operations: reviews → saved/collections/bundleInterest → `users/{uid}` → `deleteUser` | `app/src/features/account/delete/utils/deleteAccount.test.ts:99` | `pnpm exec vitest run src/features/account` (in `app/`) | 0 |
| Reauth on `auth/requires-recent-login` retries `deleteUser` exactly once; no second retry; other errors are not retried | `deleteAccount.test.ts:143`, `:152`, `:160` | same | 0 |
| Component: email gate, signs out to library, progress, password prompt (wrong then right), cancel, `errors.*` | `app/src/features/account/delete/DeleteAccountSection.test.tsx` | same | 0 |
| Manual e2e: sign up, review chatgpt, delete account; rating returns to prior value; old credentials fail | scratchpad Playwright script, not committed | see below | 0 |
| Screenshots 375 and 1280; axe reports no serious or critical issues on settings, dialog and reauth | `artifacts/screens/U3-settings{,-dialog,-reauth}-{375,1280}.png` | — | — |
| Full gate | — | as above | 0 |

**Manual e2e, how it was run:**
- Steps:
  1. Built with the slot env: `bash -c 'source scripts/slot.sh && pnpm --filter @ai-explore/app build'` (SLOT=4).
  2. Ran `scripts/emulators-exec.sh "<scratch>/u3-run.sh"`. It seeds, starts `next start -p 3004` in the background, kills that PID on exit, and runs a Playwright script.
- Fresh user:
  - chatgpt rating went from {count 2, sum 9} to {3, 10} after a 1-star review, and back to {2, 9} after the account was deleted. The UI showed 4.5 and 2 reviews again.
  - Signing in with the old credentials showed `auth-error`.
- Returning user (fresh context, clock moved forward 6 minutes):
  - The password prompt came up before anything was deleted.
  - A wrong password showed `delete.errors.wrongPassword`.
  - After the right password, all of these were gone: the review, `saved`, `collections`, `bundleInterest`, `users/{uid}`, and the auth account (Auth REST returned `EMAIL_NOT_FOUND`).

## Decisions I made that the brief didn't dictate
- **Recent-sign-in check before step 1.** If `getIdTokenResult().authTime` is 4 minutes old or more, the user reauthenticates before anything is deleted. A user who abandons the prompt then keeps both their data and their account, never one without the other. The brief's path (step 4 throws → prompt → retry once) is kept as a fallback.
- **Google-only users** reauthenticate with `reauthenticateWithPopup`, started from a button click. A password prompt would be a dead end for them.
- **Folder layout.** Sub-parts live under `delete/{components,hooks,utils,config}`, because the scope was `delete/**`.
- **Shared auth components.** I reused `AuthField` and `AuthAlert` from `@/features/auth/components`.
- **Firestore and Auth calls** live in `delete/utils/deleteAccount.ts`, following the `reviewBatch` pattern. The profile delete is a direct `deleteDoc`, because the profile endpoints have no delete.
- **Reviews are parsed with `reviewSchema.pick({toolId, rating})`.** A review is only skipped if the two fields the delete needs are invalid.
- **Library deletes are batched**, 400 or fewer per batch.
- **Error messages.** Firestore and network failures show `errors.<AppErrorCode>`. Auth-specific failures use new keys under `account.delete.errors.*`.
- **The dialog says that helpful votes the user gave stay counted** (see the known limitation below).

## Slots
- Filled: `DeleteAccountSection`
- Consumed while still stubbed: none

## Not done, and why
- Helpful votes the user gave are left in place. No rule lets the client find them (there is no collection-group rule for `votes`). This is a known limitation.
- `users/{uid}/subscriptions` is left in place. Clients only have read access to it. This is a known limitation.

## For the manager
- `useEnsureProfile` (A1) re-creates `users/{uid}` while `deleteUser` is still in flight. I reproduced it with 300 ms and 2500 ms of latency on the `accounts:delete` request. Fixed in round 2.
- `SettingsView` (U2) unmounted the danger section once the profile was gone. Fixed in round 2.
- Follow-ups:
  - Clean up the helpful votes a deleted user gave. This needs a rules or data-model change.
  - Clean up `subscriptions`. This needs a rules change.
- The Auth emulator does not enforce `requires-recent-login`. The step-4 fallback is covered only by unit tests.

# U3 hand-back · round 2

**Head sha:** e77cd01 (fix commit 4cc7134, then trunk ce533a1 merged in) · **Gate:** `scripts/gate.sh --full --task U3 --base ce533a1` → exit 0 (GATE PASS). The printed pending list is empty.

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| A profile seen for this uid and then removed is not re-created | `app/src/features/auth/hooks/useEnsureProfile.test.ts` ("does not re-create a profile that was seen and then removed") | `pnpm exec vitest run src/features/auth src/features/account` | 0 |
| First sign-in with no profile creates it exactly once | same file ("creates the profile once on a first sign-in with no profile") | same | 0 |
| No creation while an account deletion holds the uid | same file ("does not create a profile while its creation is held") | same | 0 |
| The deletion holds profile creation for its whole run and releases it on success and on error | `app/src/features/account/delete/DeleteAccountSection.test.tsx` ("holds profile re-creation…", plus the error case) | same | 0 |
| Delayed `accounts:delete` of 0, 300, 800 and 2500 ms: `users/{uid}` is gone afterwards | scratchpad `u3-delay.mjs` | `scripts/emulators-exec.sh "<scratch>/u3-run.sh u3-delay.mjs"` | 0 |
| At 2500 ms, the progress dialog stays mounted, with `account` as the active step | same; `artifacts/screens/U3-settings-progress-1280.png` | same | 0 |
| New users still get a profile: via sign-up, and via a first sign-in for an Auth-only user | `u3-delay.mjs`, `u3-first.mjs` | same | 0 |
| Round 1 e2e re-run: aggregate restored, old credentials fail, returning-user reauth, every document gone | `u3-e2e.mjs` | same | 0 |
| INV-20, INV-21, INV-23 and INV-25 green in the gate's e2e step (20 of 20) | `app/e2e/*` | gate | 0 |

## Decisions I made that the brief didn't dictate
- **New guard `holdProfileCreation(uid)` in `useEnsureProfile.ts`.** It is a module-level set of held uids and returns a release function. `useDeleteAccount` holds the uid from the start of the deletion and releases it in `finally`.
  - Why it lives in the hook file: the scope extension was exactly that file, and the flag can't live in `account` because `auth` → `account` would create a feature cycle.
- **The `seenFor` ref is set whenever the profile is non-null for the current uid.** First sign-in creation (`attemptedFor`) and the sign-up race (the transaction plus `overwriteDisplayName`) are unchanged.
- **`SettingsView` now renders the danger section as its own sibling,** shown when `user && profile !== undefined`. So it stays mounted when the profile becomes `null` mid-delete. The other four sections still wait for `profile` exactly as before.
  - The `<main>` element got `sm:px-6` (H1 finding).
- **Scope addition.** I added a third line to `scope.txt`: `app/src/features/auth/hooks/useEnsureProfile.test.ts`. The requested unit tests need a colocated test file, and the coordinator's message named only two files.

## Slots
- Filled: `DeleteAccountSection` (unchanged in this round)
- Consumed while still stubbed: none

## Not done, and why
- Same known limitations as round 1: the helpful votes the user gave, and `subscriptions`.

## For the manager
- **INV-20 flake (not in U3's path).** The first gate run failed once on `[desktop] INV-20`: the library card read "No reviews yet" where "4.0" was expected. The re-run passed, and 12 of 12 isolated repetitions passed. Likely cause:
  - The tool page's `ratingAverage` can show 4.0 from Firestore's latency-compensated local write.
  - The test then navigates straight to the server-rendered library with `page.goto`, sometimes before the batch has reached the server.
  - A failed run leaves its review behind, so later runs in the same emulator session cascade. The cause is the oracle/V1 timing, not U3. The failing log is saved at `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/gates-fail-1.log`.
- **Hand-off to other lanes.** Any other code that deletes a user's profile document should call `holdProfileCreation(uid)`, the way `useDeleteAccount` does.

# U3 hand-back · round 3

**Head sha:** 55f9e04 (trunk 6fc7145 merged in first, at 59b7a24) · **Gate:** `scripts/gate.sh --full --task U3 --base 6fc7145` → exit 0 (GATE PASS; the printed `pending:` list is empty; e2e 20/20)

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| Always reauthenticate before any delete call (order test): reauth → delete → signOut → replace; a wrong password deletes nothing | `app/src/features/account/delete/DeleteAccountSection.test.tsx` ("reauthenticates before anything is deleted…", "deletes nothing when the password is wrong") | `pnpm exec vitest run src/features/account src/features/auth` (in `app/`) | 0 |
| Google: the confirm click opens the popup, and there is no password field | same file ("confirms a Google user with the popup on the confirm click") | same | 0 |
| Dismissal is blocked while pending (Escape, X, Cancel disabled), and the flow recovers afterwards | same file ("cannot be dismissed while the reauth is pending…", "shows progress while deleting") | same | 0 |
| A stale reauth result is ignored, both up front and in the fallback | `app/src/features/account/delete/hooks/useDeleteAccount.test.tsx` (the first two tests; both fail if the stale guard is removed, checked by mutation) | same | 0 |
| Fallback copy is honest; cancelling shows a persistent alert; "Delete sign-in" finishes the deletion | `DeleteAccountSection.test.tsx` ("says the data is gone…", "keeps an alert after the sign-in prompt is cancelled…") | same | 0 |
| Delete account opens again after a cancel | `DeleteAccountSection.test.tsx` ("lets the delete button open again after a cancel") | same | 0 |
| `auth/user-mismatch` maps to `wrongGoogleAccount` | `app/src/features/account/delete/utils/deleteErrors.ts:22`, `deleteErrors.test.ts` | same | 0 |
| Verifier probe p2, adapted to the new UI | `<scratch>/r3/p2-fallback-r3.mjs`, log `<scratch>/r3/r3-p2.log` | `scripts/emulators-exec.sh "<scratch>/r3/run.sh p2-fallback-r3.mjs"` | 0 |
| Verifier probe p3, adapted to the new UI | `<scratch>/r3/p3-upfront-r3.mjs`, log `<scratch>/r3/r3.log` | `… run.sh p3-upfront-r3.mjs` | 0 (every p3 check PASS) |
| axe on settings, confirm, finish and remains at 375 and 1280; delayed `accounts:delete` at 300 and 2500 ms leaves no profile doc; progress stays mounted | `<scratch>/r3/p6-shots-r3.mjs`, log `<scratch>/r3/r3-p6.log` | `… run.sh p6-shots-r3.mjs` | 0 |
| Full gate | — | as above | 0 |

`<scratch>` is `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad`. `r3/run.sh` and `r3/lib.mjs` are unmodified copies of the verifier's. The verifier's own files in `verify-u3/` were not touched.

**Probe results**

- **p2 (fallback):**
  - The prompt reads "Finish deleting your account. Your reviews, library and settings are already deleted. Only your sign-in is left."
  - A wrong password gives `wrongPassword` and no retry. The right password gives exactly 2 `accounts:delete` calls.
  - **Cancel:** the dialog closes and the alert "Your account still exists… were deleted…" stays. The page shows Session and the danger zone, with 0 skeletons. The profile is not re-created (trace `[true,false]`). "Delete sign-in" then finishes the deletion: the auth user is gone and the rating is restored.
  - **Escape and outside clicks** are ignored while the reauth is pending, and the pending reauth still finishes.
- **p3 (up front):**
  - **Password users:**
    - The password field is in the confirm dialog, even for a fresh session.
    - With a wrong password nothing is deleted. Cancel keeps everything, and the other sections still render.
    - Delete account opens again with the email field cleared. The right password completes the deletion.
    - Escape and outside clicks are ignored while pending.
  - **Google users:**
    - The confirm click opens the popup.
    - A different account shows "That's a different Google account…" and nothing is deleted.
    - The same account completes the deletion and the profile is never re-created.

## Decisions I made that the brief didn't dictate
- **Phases.** `useDeleteAccount` has three: `confirm` (email + password, or the Google popup), `running`, and `finish` (the honest prompt shown once only the sign-in is left).
  - Every reauth attempt takes a fresh token. A result that settles after the token has changed is ignored.
  - `busy` (running or pending) blocks Escape, outside clicks, X and Cancel.
- **The finish prompt has two entry points.**
  - From the step-4 fallback, a successful reauth resumes the deletion already in flight.
  - From the persistent alert, a successful reauth re-runs the whole idempotent deletion, which ends with `deleteUser`.
- **`signInRemains`** is set only when a run stops at the `account` step (cancelled or failed). It lives in the hook, which `DeleteAccountSection` now owns, so the alert and the dialog share one state. It does not survive a reload: after a reload, `useEnsureProfile` re-creates an empty profile (first-sign-in path) and the user can delete again normally.
- **`SettingsView`:**
  - Skeleton while the user or profile is loading.
  - Profile, Language and Notifications when the profile exists.
  - Session and the danger zone whenever the profile is loaded, even if it is `null`.
  - The danger section keeps its React identity across the profile → null transition.
- **Smaller components.** `ConfirmDeleteForm` lost its item list to a new `DeleteSummary` component. `ReauthForm` became `FinishDeleteForm`. `SignInRemainsAlert` is new.
- **Removed.** The `delete.reauth.*` keys were replaced by `delete.dialog.passwordLabel`/`googleHint`, `delete.finish.*`, `delete.remains.*` and `delete.errors.wrongGoogleAccount`. en and bg keys are identical. `RECENT_SIGN_IN_MS` and `hasRecentSignIn` are gone.
- **Probe adjustment.** In my adapted p2, the alert locator is filtered to the alert that holds the "Delete sign-in" button, because Next's route announcer also has `role="alert"` (2 alerts on the page).

## Slots
- Filled: `DeleteAccountSection`
- Consumed while still stubbed: none

## Not done, and why
- Out of scope per the coordinator, kept as follow-ups:
  - re-creation of the profile by a second tab during an in-flight delete (verifier p5);
  - votes and `subscriptions` cleanup.

## For the manager
- Screenshots: the `U3-settings-reauth-*` files were removed, and `U3-settings-finish-*` and `U3-settings-remains-*` were added. `U3-settings-*` and `-dialog-*` were refreshed.
- No `next start` is left running; the slot-4 ports are free.
