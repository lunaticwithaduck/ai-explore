# A1 hand-back · round 2

**Head sha:** 5fe1ad6 · **Gate:** `scripts/gate.sh --full --task A1 --base 66e76f1 --expect-pending 20-22,24-25` → exit 0 (`GATE PASS`)

Trunk was not merged this round. Base 66e76f1 is the trunk tip from round 1. On that tip the pending set is 20 21 22 24 25, because E4 and T2 had already landed INV-18, 19 and 26.

## Round 2: verifier fixes

**1. Open redirect through `?next=` (blocking).** Fixed in 5fe1ad6, `fix(auth): reject next paths that normalise to another origin [A1]`.

- **Cause:** `sanitizeNext` checked for a leading `//` only on the raw string. It then returned the `new URL()`-normalised pathname without checking it again. Dot segments and `%2e` collapsed into `//evil.example`, and `router.replace` followed it off-site.
- **Fix** (`app/src/features/auth/utils/nextParam.ts:29-57`). The sanitiser now re-validates after normalisation and after the locale prefix is stripped:
  - the pathname must start with exactly one `/`, both raw and percent-decoded (`isSingleSlashPath`);
  - once decoded, it must contain no backslash and no control character;
  - the final `pathname + search + hash` must re-resolve to the sentinel origin (`staysOnSentinel`).
  Anything else returns `null`, and the caller falls back to `routes.library`.
- **Unit evidence:** `app/src/features/auth/utils/nextParam.test.ts:34-55`. Each rejected payload is also checked to produce `signInHref(raw) === '/sign-in'`.
  - Rejected: `/.//evil.example`, `/x/..//evil.example`, `/%2e//evil.example`, `/%2E%2E//evil.example/x`, `/%2E%2E//evil.example/path?q=1#h`, `/bg//evil.example`, `/bg/.//evil.example`, `\\evil.example`, `/\\evil.example`, `/%5Cevil.example`, `https:evil.example`, `%2F%2Fevil.example`, `/%2F%2Fevil.example`, `/%09/evil.example`, `/%0d%0a/evil.example`, `/%E0%A4%A`.
  - The round 1 rejections still hold: `/\evil.example`, `\\evil.example`, `//evil.example/phish`, absolute URLs, `javascript:`, control characters and auth-page loops.
  - Still accepted: `/tools/x?y=1#z`, and `/bg/settings` (returned as `/settings`).
  - `pnpm exec vitest run src/features/auth/utils/nextParam.test.ts` → exit 0, 40 tests. The auth and shell suites → exit 0, 72 tests.
- **Browser evidence:** production build with slot-1 emulators. Requests to `*.evil.example` were intercepted, so a successful exploit would show up as the final URL.
  - Signed in, opening `/sign-in?next=` with `%2F.%2F%2Fevil.example%2Fphish`, `%2F%252e%2F%2Fevil.example`, `%2Fx%2F..%2F%2Fevil.example`, `%2F%252E%252E%2F%2Fevil.example%2Fx` or `%2F%2Fevil.example`: final URL `http://127.0.0.1:3001/` every time.
  - Signed out, submitting the sign-in form at `/sign-in?next=%2F.%2F%2Fevil.example%2Fphish` and at `…%2F%252e%2F%2Fevil.example`: final URL `/`.
  - Control: `next=%2Ftools%2Fmidjourney` → `/tools/midjourney`.
  - Script: `scratchpad/a1/debug3.mjs` (session scratchpad). The `next start` PID was stopped, and :3001 and :8090 are free.

**2. `authErrors.ts:44` (minor).** It uses `Object.hasOwn(CODE_MAP, code)`, so prototype keys such as `toString` map to `unknown`.

**3. Process.** This file is the hand-back. Round 1 was delivered only through the agent report, so its content is reproduced below.

## Criteria
| criterion | file:line | command | exit |
|---|---|---|---|
| `?next=` accepts only a same-origin relative path, including after normalisation | `app/src/features/auth/utils/nextParam.ts:49`, `nextParam.test.ts:34-55` | `pnpm exec vitest run src/features/auth/utils/nextParam.test.ts` (40 tests) | 0 |
| Auth error mapping uses own keys only | `app/src/features/auth/utils/authErrors.ts:44`, `authErrors.test.ts` | `pnpm test` | 0 |
| INV-23 un-fixme'd (marker only) and green on mobile and desktop | `app/e2e/inv-23-locale.spec.ts:8` | full gate e2e step | 0 |
| smoke stays green, and INV-19 and INV-26 stay green with the shell | `app/e2e/smoke.spec.ts` | full gate e2e step: 10 passed, 10 skipped | 0 |
| Unit tests for the next-param sanitiser | `nextParam.test.ts` | `pnpm test` | 0 |
| Unit tests for the auth error mapping | `authErrors.test.ts` | `pnpm test` | 0 |
| Unit tests for the authSlice reducers | `app/src/features/auth/state/authSlice.test.ts` | `pnpm test` | 0 |
| (extra) Component tests for SignInView and AuthGate, plus profile-seed tests | `sign-in/SignInView.test.tsx`, `shell/AuthGate/AuthGate.test.tsx`, `utils/profileSeed.test.ts` | `pnpm test` | 0 |
| Profile create writes exactly the rules' create fields | `app/src/api/endpoints/profile.ts:46-53` | INV-23 under the rules, plus the verifier's probe | 0 |
| Full gate | `prompt/overnight/tasks/A1/gates.log` | `scripts/gate.sh --full --task A1 --base 66e76f1 --expect-pending 20-22,24-25` | 0 |
| Screenshots | `artifacts/screens/A1-library-375.png`, `A1-library-1280.png`, `A1-library-signed-in-1280.png`, `A1-sign-in-375.png` (+ `A1-menu-375`, `A1-user-menu-1280`, `A1-sign-in-error-375`, `A1-sign-in-bg-1280`) | Playwright scratch script against `next start` | 0 |

## Decisions I made that the brief didn't dictate
- **`AppShell` awaits `connection()`.** The build runs without emulators, so a statically prerendered page would otherwise ship an empty category sidebar. The auth views, Sidebar and NavigationWatcher use `useSearchParams` without Suspense and rely on this.
- **No duplicate test ids.** The header locale switcher and search, and the desktop sidebar, are not mounted while the mobile Sheet is open (state lives in `ShellFrame`). Otherwise the oracle's `getByTestId` locators hit strict-mode violations at 375. Layout switching is still done with CSS breakpoints.
- **AuthGate after a sign-out:** if the gate saw `signedIn` and the user then signs out, it goes to the library rather than `sign-in?next=`. `useSignOut` never navigates, so there are no competing `router.replace` calls. The verifier flagged this as a brief gap to ratify.
- **`useIsAdmin()` returns `{ isAdmin, isLoading }`** so that the AdminGate can show a skeleton.
- **`ensureProfile` is a Firestore transaction.** It creates the profile if missing; with `overwriteDisplayName`, it updates only `displayName`. `onAuthStateChanged` fires before `updateProfile` during sign-up, so this keeps the race idempotent. The listener uses a fallback name: the auth name, else the email local part, capped at 60 characters. `photoUrl` is kept only for http(s) URLs of 2048 characters or fewer.
- **The profile locale is applied once per mount and user, and auth routes are skipped,** so the sign-in redirect and the locale redirect do not race.
- **Auth SDK calls live in `features/auth/utils/authActions.ts`, not RTK.** `firestoreCall` would collapse Auth codes to `unknown`.
- **`ToastProvider` is not mounted.** Radix ToastProvider sets its viewport in state on mount. That context change made React client-render H1a's still-dehydrated `(public)/loading.tsx` boundary while the hidden server copy stayed in the DOM, and smoke and INV-26 then saw duplicate content. No lane renders toasts.
- **Sidebar is `w-72`,** so the Bulgarian category names fit. The background sits on a full-height column and only the inner panel is sticky.

## Slots
- Filled: `AppShell`, `AuthGate`, `SignInView`, `SignUpView`, `ResetPasswordView`.
- Consumed while still stubbed: `NotificationsBell` (N1) and `SidebarCollections` (U1).

## Not done, and why
- **Verifier non-blocking notes, left for a later round as instructed** ("fix only these"):
  - `useEnsureProfile` does not retry a failed create within the same session.
  - `useLocaleSwitch` attempts the write even when the profile is still `null`; it fails quietly.
- **No toast host** (see Decisions).

## For the manager
- **Public API for Phase 5:**
  - `@/features/auth/hooks/`: `useCurrentUser`, `useIsAdmin`, `useSignOut`, `useLocaleSwitch` (U2), `useCurrentProfile`, `useAppLocale`.
  - `@/features/auth/utils/`: `signInHref` and `signUpHref` (M1), `initials`.
  - `@/api/endpoints/profile`: `useProfileQuery`, `useUpdateProfileMutation`, `useEnsureProfileMutation`, `ProfilePatch`, `DEFAULT_PROFILE_PREFS`.
- **Follow-up (UI):** a toast host must not wrap streamed page content.
- **Follow-up (A1):** if `connection()` ever leaves AppShell, the `useSearchParams` consumers need Suspense boundaries.
- **Follow-up (brief template):** sanitiser acceptance criteria should name adversarial normalisation cases, as the verifier noted.
