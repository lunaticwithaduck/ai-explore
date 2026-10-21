**Template:** feature-common-v1. Every feature-lane brief includes this file by reference. It is binding.

## Read first (every feature lane)
1. `~/Repos/ai-explore/prompt/CLAUDE.md`. Binding.
2. The D1 **API cheat-sheet** in `~/Repos/ai-explore/prompt/overnight/tasks/D1/handback.md` (all primitives
   and their props), plus `packages/ui/src/index.ts`.
3. The contracts that are already on trunk. Do not edit them:
   - `app/src/config/{routes,test-ids,feature-flags,env}.ts`
   - `app/src/api/{firestoreApi,firestoreCall,errors,hooks,rootReducer}.ts`
   - `app/src/api/server/*.ts`
   - `app/src/lib/{firebase,format,feature-flags}/*`
   - `app/src/i18n/*`
4. The **stub you fill**. Its exported name and props type are a contract with the `page.tsx` that renders
   it (manager-owned). Keep the export name and props; replace the body.
5. The **e2e oracle specs** for your INVs in `app/e2e/inv-*.spec.ts`. They show the exact selectors and
   behaviour that will be checked. Read them before building.
6. The visual reference in `reference/figma-make/src/app/components/*` (read-only). Match its layout and feel,
   not its code.

## How to build
- **Layering:** `app → shell → features → shared (api, lib, i18n) → config`. Features import another feature
  only through `@/features/<domain>/(components|hooks|utils|config)/…`. The linter enforces this.
- **Components:**
  - Put each in `features/<domain>/components/<Name>/<Name>.tsx`, with styles in `<Name>.styles.ts`
    (cva, or an `as const` object of class strings).
  - One component per file, 200 lines or fewer.
  - Compose `@ai-explore/ui` primitives only. No raw `button/input/a/img/h1–h6/p/label`, no hex, no
    arbitrary Tailwind values, and no `style={}`.
- **Copy:** every user-facing string, including aria-labels and placeholders, goes in your namespace(s) in
  `app/src/messages/{en,bg}/<ns>.json`, with identical keys and natural Bulgarian.
  - Client components use `useTranslations('<ns>')`; server components use `getTranslations`.
  - Firestore errors show `errors.<AppErrorCode>`.
- **Test ids:** attach every `TEST_IDS.*` element your area owns. Repeated items also carry `data-id`
  (slug, id, period, locale, rating value). Use ARIA state for toggles (`aria-pressed`, `aria-checked`).
- **Server data** comes from the page as props. **Client data** goes through RTK Query:
  - in `app/src/api/endpoints/<domain>.ts`, via `firestoreApi.injectEndpoints({ endpoints: (build) => ({…}) })`;
  - `queryFn: () => firestoreCall(async () => …)`;
  - realtime through `onCacheEntryAdded` + `onSnapshot` (unsubscribe on `cacheEntryRemoved`);
  - tags for invalidation;
  - hooks exported from that file.
  Parse every read with `parseDoc` / `parseDocs` and the schemas. There is no Firestore access in components.
- **Writes:**
  - Write exactly the fields the rules allow (see `prompt/overnight/tasks/O1/brief.md` §"The rules contract").
  - Timestamps are `serverTimestamp()`.
  - Aggregates change only in the batch helper that owns them.
- **Locale:** `useLocale()` plus `pickLocalized(value, locale)` for `Localized` fields.
- **Format** with `formatCents`, `averageRating` / `formatAverage` and `formatVersion`.
- **Links:** `Link` from `@/i18n/navigation`, wrapped in `TextLink asChild` or `Button asChild`. Hrefs come
  from `routes`. Never write a literal path.
- **Signed-in state** (Phase 5 lanes): use `useCurrentUser()` from `@/features/auth/hooks/useCurrentUser`
  (A1). It returns `{ status: 'loading' | 'signedIn' | 'signedOut', user }`.

## How to verify
- **Slot environment:** `NEXT_PUBLIC_*` values are inlined at build time, so build with the slot env:
  `bash -c 'source scripts/slot.sh && pnpm --filter @ai-explore/app build'`. Source `slot.sh` only from bash, never zsh.
- **Never kill processes globally** (`pkill -f next`, `killall node`, etc.): sibling workers run their own
  servers. Stop only the PID you started.
- Write unit tests (vitest + Testing Library, colocated) for logic and for the key component behaviour.
- Remove `fixme` from your INV specs only. Never edit their assertions.
- Build, then run your specs fast inside your slot's emulators:
  `pnpm --filter @ai-explore/app build && scripts/emulators-exec.sh "scripts/seed.sh && cd app && pnpm exec playwright test e2e/<spec>"`.
- Done means `scripts/gate.sh --full --task <id> --base <base>` → `GATE PASS`.
- Screenshot your main route(s) at 375 and 1280 into `artifacts/screens/<id>-<route>-<width>.png`.
  Build, then run inside emulators with `(pnpm exec next start -p $APP_PORT &)` and
  `pnpm exec playwright screenshot --full-page --viewport-size=<w>,900 <url> <file>`, and make sure no
  stray `next start` is left running. **Look at them.** Fix anything that looks broken or unlike the
  prototype's polish.

## Out of scope for every feature lane
`page.tsx` and `layout.tsx` route files, `config/*`, `api/firestoreApi.ts`, `api/server/*`, other lanes'
folders and namespaces, `firebase/**`, `packages/**`, and dependencies.

## Stop conditions (do not guess)
Stop and hand back instead when:
- you need a file outside scope;
- you need a new primitive or token. Say which, and compose what exists meanwhile if possible;
- an INV assertion looks wrong;
- a contract (props, test id, route) is missing something you need;
- you hit a permission prompt or classifier block. Quote it verbatim.

## Boundaries
- No push, no deploy, emulators only, no new dependencies.
- No comments.
- `git add` only with named files; never `--no-verify`.
- Commit as `feat(<domain>): <summary> [<id>]` with a why-body and
  `Co-Authored-By: Claude <Sonnet|Opus> 5.5 <noreply@anthropic.com>`.
- Hand back with `prompt/overnight/templates/handback.md`.

## Phase 5 notes: the A1 API (from A1's hand-back, on branch `overnight/A1`)
- **`@/features/auth/hooks/`:**
  - `useCurrentUser()` → `{ status, user: { uid, email, displayName, photoUrl } | null }`;
  - `useIsAdmin()` → `{ isAdmin, isLoading }`;
  - `useSignOut()`;
  - `useLocaleSwitch()`, which writes `users/{uid}.locale` and replaces the route;
  - `useCurrentProfile()`, `useAppLocale()`.
- **`@/features/auth/utils/`:** `signInHref(next)`, `signUpHref(next)`, `initials(name)`.
- **`@/api/endpoints/profile`:** `useProfileQuery(uid)` (realtime, `ProfileDoc | null`),
  `useUpdateProfileMutation({ uid, patch })`, `useEnsureProfileMutation`, `ProfilePatch`, `DEFAULT_PROFILE_PREFS`.
  Reuse these and do not duplicate profile reads or writes.
- **No toast provider is mounted.** A Radix ToastProvider around streamed content breaks hydration. Show inline status
  messages instead of toasts.
- **The shell mounts header and sidebar controls only once per viewport,** so test ids stay unique. Do not render a second
  copy of a shell-owned test id.
- **RTK endpoint names are global** across every `injectEndpoints` call. Prefix yours by domain
  (`myLibrarySave…`, `adminSaveTool`, …), and grep `app/src/api/endpoints` before naming one.
- **Read client-only state after hydration.** Server HTML and the first client render must match; otherwise React
  re-renders and input typed during that window is lost (React #418). Gate auth-dependent UI on a hydrated flag.
- `app/AGENTS.md` is generated by `next dev`. It is gitignored; never commit it.
