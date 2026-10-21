# A1 verdict · verifier-v1

**Worktree:** `~/Repos/ai-explore-wt/A1` · **Base:** 66e76f1 · **Head:** 60e02c9 · **Slot:** 1
**Probe artefacts:** `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/verify-a1/` (`gates.log`, `browser-probe.cjs` + `probe.out`, `probe-next.test.ts` + `vitest.probe.config.mjs`)
**Git status after verification:** clean (`git status --short` → empty, exit 0); no listener left on :3001 or :8090.

## Blocking finding: open redirect through `?next=`

`sanitizeNext` checks `raw.startsWith('//')` on the raw string (`app/src/features/auth/utils/nextParam.ts:22`). It then normalises the value with `new URL(raw, SENTINEL)` (`:26`) and returns the normalised `url.pathname` (`:31-33`) without checking it again. Dot segments collapse after the check:

- `/.//evil.example` → `//evil.example`
- `/x/..//evil.example` → `//evil.example`
- `/%2e//evil.example` → `//evil.example`
- `/%2E%2E//evil.example/path?q=1#h` → `//evil.example/path?q=1#h`

The vitest probe shows all four. In `useRedirectWhenSignedIn.ts:13` the result goes to `router.replace(next)`. next-intl treats `//host` as a local href and adds no prefix for the default locale (`node_modules/next-intl/dist/esm/development/shared/utils.js:5-12`). Next then performs an external navigation.

**Repro on the production build** (browser probe, slot-1 emulators):
- `/sign-in?next=%2F.%2F%2Fevil.example%2Fphish`: sign in, and the browser lands on `http://evil.example/phish`.
- A user who is already signed in and opens the same link is bounced off-site at once, with no interaction.
- `%2F%252e%2F%2Fevil.example` behaves the same way.
- Control: plain `%2F%2Fevil.example` is rejected and lands on `/`.
- `/sign-up?next=…` is also affected through the same hook. The `/bg/…` auth pages are not, because the `/bg` prefix makes the result same-origin.

**Suggested fix:**
1. After normalisation, reject the value if `pathname` starts with `//` (or `/\`).
2. Better, compare the re-resolved `new URL(result, SENTINEL).origin` against the sentinel origin.
3. Add the four payloads above to `nextParam.test.ts`.

## Criteria

FAIL — Redirect after sign-in/sign-up honours `?next=` only for a same-origin relative path (brief §Auth; focus 2) — evidence: nextParam.ts:22,26,31-33; useRedirectWhenSignedIn.ts:13; `pnpm exec vitest run --config …/vitest.probe.config.mjs` → exit 0 (`sanitizeNext("/.//evil.example") => "//evil.example"`); `scripts/emulators-exec.sh "scripts/seed.sh && node …/browser-probe.cjs"` → exit 0, probe.out `[redirect] … final=http://evil.example/phish` (both signed-out and already-signed-in)
PASS — `?next=` rejects absolute URLs, protocol-relative `//evil`, backslashes, control chars, `javascript:`, and auth-page loops (`/sign-in`, `/bg/sign-up?next=…`, `/./sign-in`, `/%2e/sign-in`) — evidence: nextParam.ts:22-32, nextParam.test.ts:15-43; probe-next.test.ts → `/./sign-in => null`, `/%2e/sign-in => null`; browser probe `next=%2F%2Fevil.example` → final `/`
PASS — Happy path: a safe `?next=` is honoured, otherwise the library — evidence: useRedirectWhenSignedIn.ts:13; browser probe `[next] … → /tools/midjourney`, `[signup] w=1280 landed /bg/compare`; SignInView.test.tsx:85-106; `pnpm exec vitest run src/features/auth src/shell src/messages` → exit 0 (54 tests)
PASS — INV-23 un-fixme'd (marker only) and green on both projects; smoke stays green — evidence: `git diff 66e76f1..60e02c9 -- app/e2e/` (only `test.fixme(`→`test(`), gates.log:326 `✓ 5 [mobile] … INV-23`, :336 `✓ 15 [desktop] … INV-23`, :330-331 and :340-341 smoke ✓; gate → exit 0
PASS — `scripts/gate.sh --full --task A1 --base 66e76f1 --expect-pending 20-22,24-25` → GATE PASS — evidence: biome, conventions, node-tests, typecheck, test, rules (146/146), e2e (10 passed, 10 skipped), scope, oracle, pending `20 21 22 24 25` all exit 0; gate → exit 0
PASS — Unit tests cover the next-param sanitiser, the auth error mapping and the authSlice reducers — evidence: nextParam.test.ts (22 tests), authErrors.test.ts (15), authSlice.test.ts (6), AuthGate.test.tsx (4), SignInView.test.tsx (4), profileSeed.test.ts (3); `pnpm exec vitest run` (app, no turbo cache) → exit 0, 22 files / 132 tests
PASS — Profile create writes exactly the rules' create field set: displayName, photoUrl null, route locale, prefs {productUpdates:true, emailDigest:false}, notificationsSeenAt null, createdAt serverTimestamp (focus 1) — evidence: profile.ts:46-53,89; firestore.rules:145-164; browser probe `[signup] doc … keys=createdAt,displayName,locale,notificationsSeenAt,photoUrl,prefs`, `photoUrl:nullValue`, `notificationsSeenAt:nullValue`, `locale:"bg"` from /bg/sign-up and `"en"` from /sign-up; createTime ≈ createdAt (server time)
PASS — Sign-up race (onAuthStateChanged fires before updateProfile) is idempotent and ends with the typed display name — evidence: profile.ts:83-96 (transaction: create if missing, else update displayName only); SignUpForm.tsx:38-46 (`overwriteDisplayName: true`); useEnsureProfile.ts:15-24 (once per uid); authSlice.ts:31-33 (`userUpdated`, because updateProfile does not re-fire onAuthStateChanged); probe: displayName = typed name, createTime == updateTime (single write)
PASS — Profile create input is bounded to the rules: displayName 1–60, photoUrl http(s) ≤ 2048 or null — evidence: profileSeed.ts:4-18, schemas.ts:15-19, profileSeed.test.ts:14-26
PASS — `useProfileQuery(uid)` is realtime, and `useUpdateProfileMutation` patches only displayName/photoUrl/locale/prefs — evidence: profile.ts:24-26,64-81,97-104
PASS — AuthGate shows a skeleton while loading, never renders children unless status is signedIn, and redirects a signed-out user to sign-in with `?next=` and no loop (focus 3) — evidence: AuthGate.tsx:20-28; AuthGate.test.tsx:39-73; browser probe `[gate]` for `/library?collection=c1`, `/bg/settings` and `/profile` at 375 and 1280 → `/sign-in?next=%2Flibrary%3Fcollection%3Dc1`, `/bg/sign-in?next=%2Fsettings` with navCount=3 (load, hydrate, one replace)
PASS — Locale persistence writes only `users/{request uid}.locale` and cannot fight the sign-in redirect (focus 4) — evidence: useLocaleSwitch.ts:19-24 (`uid: user.uid`); useProfileLocaleSync.ts:17-22 (skipped on auth routes, once per uid per session, reset on sign-out); routing through `@/i18n/navigation`; INV-23 green both projects
PASS — No Firebase Auth message reaches the UI raw (focus 5) — evidence: authErrors.ts:30-45, every catch site maps through toAuthErrorKey (SignInForm.tsx:35, SignUpForm.tsx:48, GoogleButton.tsx:29, ResetPasswordForm.tsx:33-34); ensureProfile is not unwrapped, so Firestore errors never throw into the form; browser probe: wrong password → `"That email and password don't match…"` (== en errors.invalidCredential), existing email → errors.emailInUse, page text has no `firebase`/`auth/`
PASS — Shell never duplicates test ids across viewports and renders no extra `<main>` (focus 6) — evidence: ShellFrame.tsx:29-38 and Header.tsx:26-35 (desktop copies unmounted while the Sheet is open); browser probe `[ids]` at 375/1280, signed in and out, menu open and closed: every shell id ≤ 1, `dupAny=[]`, `main` ≤ 1 (GateSkeleton's `<main>` only replaces children)
PASS — Header: brand → library, search → `routes.libraryWith({q})`, NotificationsBell (mobile too), desktop-only locale switcher, user menu (Profile/Settings/Admin-if-admin/Sign out) or Sign in — evidence: BrandLink.tsx:13, HeaderSearch.tsx:22, Header.tsx:30-36, Header.styles.ts:7, UserMenu.tsx:69-88, AccountArea.tsx:16-22
PASS — Sidebar: categories with `data-id` → `libraryWith({category})`, My Library only when signed in, Bundles and Compare, locale switcher in the mobile Sheet; CSS breakpoint at lg — evidence: Sidebar.tsx:37-73, MobileNav.tsx:34,39-47, ShellFrame.styles.ts:4
PASS — Auth state: AuthListener in the shell, slice `{status, user:{uid,email,displayName,photoUrl}}` via `injectInto(rootReducer)`, `useCurrentUser`, `useIsAdmin` reading only `admins/{uid}` — evidence: ShellFrame.tsx:22, authSlice.ts:5-17,37, useCurrentUser.ts:4-6, useIsAdmin.ts:10-18, auth.ts:9-13, firestore.rules:267-269
PASS — Sign-up, sign-in (email + Google popup), reset password and sign out use react-hook-form + zod — evidence: authActions.ts:28-56, SignUpForm.tsx:28-31, SignInForm.tsx:23-26, ResetPasswordForm.tsx:22-25, UserMenu.tsx:84; reset does not reveal whether an account exists (ResetPasswordForm.tsx:33)
PASS — Conventions: no banned raw HTML, tokens only, no `style={}`, copy only from messages, en/bg parity (focus 7) — evidence: gate biome and conventions → exit 0; diff grep for `style=|#hex|px|rem|-[…]|<button|<input|<a |<img|<h1-6|<p|<label` finds only a test mock (SignInView.test.tsx:19); node key-parity script → shell 26/26, auth 40/40, 0 missing, 0 empty (exit 0); authErrors.test.ts:39-44
PASS — Scope and contracts: only scope.txt paths changed, no contract file touched, stub export names and props kept — evidence: gate scope → exit 0; `git diff --stat 66e76f1..60e02c9 -- packages firebase app/src/config app/src/api/firestoreApi.ts app/src/api/rootReducer.ts app/src/i18n app/src/lib` → empty; AppShell, SignInView, SignUpView and ResetPasswordView signatures match base; largest file 108 lines
PASS — Screenshots: library at 375 and 1280 signed out, 1280 signed in, sign-in at 375 — evidence: artifacts/screens/A1-library-375.png, A1-library-1280.png, A1-library-signed-in-1280.png, A1-sign-in-375.png (viewed: dark Steam-like chrome, sidebar full height, no broken layout)
FAIL — Hand-back written to `prompt/overnight/tasks/A1/handback.md` (LOOP.md:101; verifier step 5) — evidence: `cat …/tasks/A1/handback.md` → "No such file or directory"; not in the worktree or git history. Decisions were reconstructed from commit bodies (313b437, 4c6731b, 60e02c9) and the manager's "Phase 5 notes" in templates/feature-common.md.
PASS — Decisions vs stop conditions: none hit a stop condition. The reconstructed decisions are: transactional ensureProfile; `connection()` in AppShell (only the auth, admin and ui routes newly become ƒ, since tools and bundles were already ƒ on trunk per H2 and H1a gates.log); ToastProvider removed (no lane renders toasts); after an explicit sign-out on a gated page, go to the library instead of `sign-in?next=`; profile locale applied once per session. All stay within scope, add no dependency, primitive or token, and leave no INV assertion edited — evidence: AppShell.tsx:11-23, AuthGate.tsx:21-24, ShellFrame.tsx (60e02c9), gate scope and oracle → exit 0
BRIEF GAP — The brief names base 80643ef and `--expect-pending 18-22,24-26`. Trunk has since landed INV-18, 19 and 26, so verification used 66e76f1 and 20-22,24-25 as instructed — evidence: brief.md header vs ledger.md:74 and gates.log pending line
BRIEF GAP — The acceptance list asks only that unit tests "cover the next-param sanitiser". It names no adversarial normalisation cases (dot segments, percent-encoded dots, re-checking the result after normalisation), so the open redirect passed every listed check — evidence: brief.md §Acceptance
BRIEF GAP — No criterion checks the client's profile-create payload against the real rules (only INV-23 covers it, indirectly). The verifier's emulator probe covered it this time — evidence: brief.md §Acceptance; firebase/tests has no client-payload test
BRIEF GAP — The brief does not say where AuthGate sends a user who signs out while on a gated page. The worker chose the library over `sign-in?next=`, which is reasonable and should be ratified — evidence: AuthGate.tsx:21-24, AuthGate.test.tsx:64-73

Non-blocking notes:
- `authErrors.ts:44` uses `code in CODE_MAP`, which walks the prototype chain: a code of `toString` would return a function. Firebase never emits such a code. Prefer `Object.hasOwn`.
- `useEnsureProfile.ts:17` marks the uid as attempted before the write succeeds, so a failed create is not retried in that session.
- `useLocaleSwitch.ts:19` writes even when the profile is `null` (not created yet). The `updateDoc` fails quietly in that case.

VERDICT: FAIL

---
## Round 2 re-check (manager, 02:03)

Scope: the single FAIL item (open redirect), plus the Object.hasOwn nit. Round 2 changes only `nextParam.ts`, its test, and `authErrors.ts` (`git diff 60e02c9..5fe1ad6 --stat`).
- PASS: open redirect fixed. `app/src/features/auth/utils/nextParam.ts:47-57` re-checks after normalisation, locale stripping and decoding, and requires the final result to resolve on the sentinel origin. Evidence:
  - the worker's tests: 40 in `nextParam.test.ts`, including all four verifier payloads;
  - a manager fuzz probe of 17 further payloads (`%2e%2e` dot segments, double-encoded slashes, tab/LF, `%5C`, `///`, `javascript:`, the RTL override): none produced an off-origin or `//` result, and safe paths were kept. Command `pnpm exec vitest run <temporary probe>` → 20/20 passed. The probe file was deleted and the worktree is clean.
- PASS: `authErrors.ts` uses `Object.hasOwn`.
- PASS: gate `scripts/gate.sh --full --task A1 --base 66e76f1 --expect-pending 20-22,24-25` → exit 0 (worker), and re-run on the merge below.
- Process: `handback.md` now exists.

VERDICT: PASS
