**Template:** brief-v1 · **Task:** A1 · **Phase:** 4 · **Model:** opus (verified) · **Base sha:** 80643ef

# A1 — App shell, Firebase Auth, and locale persistence

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/shell/**`, `app/src/features/auth/**`, `app/src/api/endpoints/{auth,profile}.ts`,
`app/src/messages/{en,bg}/{shell,auth}.json`, `artifacts/screens/A1-*`.
Stubs you replace:
- `shell/AppShell/AppShell.tsx`, `shell/AuthGate/AuthGate.tsx`;
- `features/auth/{sign-in,sign-up,reset-password}/*View.tsx`.

## Owns
INV-23. Read `app/e2e/inv-23-locale.spec.ts` and the helpers in `app/e2e/fixtures/auth.ts`; they define the auth flow the rest of the oracle relies on.

## Goal

### Auth (Firebase Auth via `clientAuth()`)
- **Sign-up:** display name, email and password, then `updateProfile`.
- **Sign-in:** email and password, plus Google through `signInWithPopup`. The auth emulator supports it.
- **Reset password** and **sign out**.
- Forms use react-hook-form + zod.
- **Error copy:** map Firebase Auth codes (`auth/invalid-credential`, `auth/email-already-in-use`,
  `auth/weak-password`, and so on) to `auth.errors.*`. Never show raw messages.
- **Redirect after sign-up or sign-in:** go to `?next=` (only a same-origin relative path is accepted),
  otherwise the library.

### Auth state
- An `AuthListener` client component inside AppShell runs `onAuthStateChanged` and dispatches to
  `features/auth/state/authSlice.ts`, injected with `authSlice.injectInto(rootReducer)`.
- The slice state is `{ status: 'loading' | 'signedIn' | 'signedOut', user: { uid, email, displayName, photoUrl } | null }`.
- Export `useCurrentUser()` from `features/auth/hooks/useCurrentUser.ts`. Phase 5 lanes depend on this exact shape.
- Export `useIsAdmin()` from `features/auth/hooks/useIsAdmin.ts`. It reads `admins/{uid}`; a user may read only their own document.

### Profile (`api/endpoints/profile.ts`)
- On the first signed-in session, create `users/{uid}` if it is missing. Use exactly the rules' create
  fields:
  - `displayName`;
  - `photoUrl` (null when absent);
  - `locale`, the current route locale;
  - `prefs: { productUpdates: true, emailDigest: false }`;
  - `notificationsSeenAt: null`;
  - `createdAt: serverTimestamp()`.
- Export a realtime `useProfileQuery(uid)` and `useUpdateProfileMutation`. U2 extends this file later.

### Locale persistence (INV-23)
- When a signed-in user switches locale, write `users/{uid}.locale`.
- After sign-in, if `profile.locale` differs from the current locale, `router.replace` to the same path in
  the profile locale, using `useRouter` / `usePathname` from `@/i18n/navigation`.

### AuthGate
- While `loading`, show a skeleton.
- When `signedOut`, `router.replace(routes.signIn + '?next=' + current path)`.
- When `signedIn`, render the children.

### Shell
AppShell may be an async server component that loads `getCategories()` and renders client islands.

**Header** (`TEST_IDS.shell.header`):
- app name, linking to the library;
- the search box (`shell.searchInput`), which submits to `routes.libraryWith({ q })`;
- `NotificationsBell` from `@/features/notifications/components/NotificationsBell/NotificationsBell`
  (it is a stub until N1), visible on mobile too;
- the locale switcher (`shell.localeSwitcher`, options `shell.localeOption` with `data-id`), desktop only;
- the user menu (`shell.userMenu`, an Avatar dropdown with Profile, Settings, Admin (only if
  `useIsAdmin`), and Sign out `shell.signOut`), always visible when signed in;
- otherwise Sign in (`shell.signIn`).

**Sidebar** (`shell.sidebar`):
- categories as `shell.sidebarCategory` with `data-id`, linking to `routes.libraryWith({ category })`;
- My Library (Saved link plus `SidebarCollections` from `@/features/my-library/components/SidebarCollections/SidebarCollections`),
  only when signed in;
- links to Bundles and Compare;
- on mobile, the locale switcher.

**Layout:** below the `lg` breakpoint, the sidebar moves into a `Sheet` opened by
`shell.mobileMenuButton`. Use a CSS breakpoint, not JS viewport branching.

Match the prototype's Steam-like dark chrome (`reference/figma-make/src/app/components/{Header,Sidebar}.tsx`).

## Acceptance
- [ ] INV-23 is un-fixme'd and green. `smoke.spec.ts` stays green.
- [ ] Unit tests cover the next-param sanitiser, the auth error mapping and the authSlice reducers.
- [ ] `scripts/gate.sh --full --task A1 --base 80643ef --expect-pending 18-22,24-26` → `GATE PASS`.
- [ ] Screenshots: library chrome at 375 and 1280 signed out, at 1280 signed in, and sign-in at 375.
