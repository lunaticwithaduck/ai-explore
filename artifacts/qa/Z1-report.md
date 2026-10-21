# Z1 release audit: correctness, security and robustness

**Base:** `ce533a1` · **Worktree:** `~/Repos/ai-explore-wt/Z1` · **Slot:** 5 (app 3005, Firestore 8130, Auth 9149)
**Probes and raw output:** `/private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/z1/`
(`probe-*.cjs` scripts, `*.out` logs, `lib.cjs` helpers). No product code changed.

**How it ran**
- `SLOT=5 bash -c 'source scripts/slot.sh && pnpm --filter @ai-explore/app build'` → exit 0 (`build.log`).
- `SLOT=5 scripts/emulators-exec.sh "bash …/z1/serve.sh"` (runs `scripts/seed.sh`, then `next start -p 3005`) → seeded 51 documents, server ready.
- Every probe: `node probe-<name>.cjs …` → exit 0 unless noted. The probes drive Playwright Chromium 1.64 at 375 and 1280.
- For the "emulator stopped" check I paused (`SIGSTOP`/`SIGCONT`) and then terminated only my own Firestore emulator (PID 65008). I relaunched once for two follow-up probes, then stopped my `next start`, and the emulator suite shut down. No slot-5 port is listening now.

Known issues from `follow-ups.md`, `parked.md` and the verdicts are not reported again. They include the latency-compensated rating (U3 → Z2), per-request rendering (C2), the `/bg` link redirect (Q1-m29), orphaned votes, and reviews on unpublished tools. Account deletion is still a stub on this base (`DeleteAccountSection` returns `null`; U3 round 2 is in flight), so I did not audit it.

| Severity | Count |
|---|---|
| Blocker | 1 |
| Major | 5 |
| Minor | 10 |

---

## Blocker

### B1 · Every first visit to a tool page or bundle page throws React hydration error #418 for visitors
- **Repro:** use a fresh browser profile with an empty HTTP cache, signed out. Open `/tools/midjourney`, `/tools/jasper`, `/bundles/startup-founder-pack`, or the same pages under `/bg/…`. The console shows `Minified React error #418 … args[]=HTML`. React then throws away the server HTML for that boundary and renders it again on the client.
- **Evidence:**
  - `node probe-cold.cjs visitor 3` → exit 0 (`cold-visitor.out`). Tool and bundle-detail pages failed in **30/30** cold loads (5 routes × 2 widths × 3 runs, en and bg). `/`, `/bundles`, `/compare` and `/sign-in` were clean (0/3 each).
  - `node probe-cold.cjs member-cold 2` (signed in, cache cleared) → exit 0 (`cold-member.out`): **0** errors on every route.
  - With a warm cache the error is intermittent: 1/8 loads (`hydration-1x.out`). That is why the e2e suite and earlier sweeps missed it.
- **Cause (by elimination):** the page content hydrates inside the `loading.tsx` Suspense boundary, after the layout has hydrated. By then `AuthListener` has already dispatched `signedOut`, so components that branch on `status === 'signedOut'` render a different element from the server's `loading` HTML:
  - `features/reviews/components/ReviewComposer/ReviewComposer.tsx:27`: the server renders the skeleton, the client renders `ReviewSignInPrompt`.
  - `features/bundle-interest/components/NotifyMeButton/NotifyMeButton.tsx:32`: the server renders the disabled loading button, the client renders the sign-in link.
  - `features/reviews/components/HelpfulButton/HelpfulButton.tsx:28` has the same pattern. It is latent, because reviews are client-loaded.
  - The components U1 fixed (`useSavedTools` and `useUserCollections`, which gate on `useHydrated()`, see `features/my-library/hooks/useSavedTools.ts:15-20`) do not misbehave. Pages without unguarded consumers are clean. Signed-in users are clean, because their status at hydration renders the same skeleton.
- **Impact:** the most important audience, a first-time visitor arriving from search or a shared link, gets a console error. The whole tool or bundle page body is rendered twice, which hurts LCP and causes a visible flash. The manager treated this exact error class as a blocker in U1.
- **Fix:** do it centrally. Make `useCurrentUser()` return `{ status: 'loading', user: null }` until `useHydrated()` is true (`features/auth/hooks/useCurrentUser.ts`), or apply the `useHydrated` guard in the three components above. Add a cold-cache visitor load of `/tools/jasper` and `/bundles/<slug>` to an e2e smoke test, using a fresh context per load and failing on `pageerror`.
- **Owner:** `features/auth` (central fix), or `features/reviews` plus `features/bundle-interest`.

---

## Major

### M1 · Review author fields are trusted from the client. Any user can make every visitor's browser fetch a URL they choose, post as "AI Explore Team", or hide a counted rating
- **Repro:** sign up, then commit the normal create-review batch through the SDK or REST, but set `authorPhotoUrl` to `https://tracker.example/pixel.gif?u=1` and `authorName` to `AI Explore Team ✔`. A second user does the same with `authorPhotoUrl: "not a url at all"`.
- **Evidence:** `node probe-review-payload.cjs` → exit 0 (`review-payload.out`):
  - Both commits returned `200`. The rules accept them: `firebase/firestore.rules:42-44` (`isUrlText` accepts any string of 2048 characters or fewer) and `:101-102`.
  - Opening `/tools/jasper` as a visitor made **one request to `tracker.example`**.
  - The second review fails the client schema (`packages/schemas/src/review.ts:13`, `z.url()`) and is logged as `Dropped invalid document …`. The page showed **1 review item but "2 reviews"** in the summary, and the hidden 1-star rating still counts in the average.
  - Probe data was cleaned up, and the rating returned to `{0,0}`.
- **Impact:**
  - Privacy: any signed-in user can collect the IP address and user agent of every visitor to a tool page through `<img src>` (`features/reviews/components/ReviewItem/ReviewItem.tsx:30`). There is no CSP in `app/next.config.ts`.
  - Impersonation in review bylines.
  - A rating that cannot be seen or contested.
  - The rules and the zod schema disagree, which breaks the "never rendered half-valid" contract without the user noticing.
- **Fix:** in rules, require `authorPhotoUrl == null` or an `https://` URL on an allow-listed host (for example `lh3.googleusercontent.com`). Ideally also require `authorName == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.displayName`. Align `reviewSchema` with the rule so that a document the rules accept always renders. Add rules tests for both cases.
- **Owner:** `firebase/` (rules and tests), `packages/schemas`.

### M2 · Server-side Firestore reads have no timeout, so a slow or hung Firestore makes every route hang with no response
- **Repro:** pause the Firestore backend (I used `kill -STOP` on my emulator), then request any page.
- **Evidence:** `node probe-emu-down.cjs 65008 STOP` → exit 0 (`emu-stop.out`):
  - `fresh SSR /tools/jasper: NO RESPONSE … Timeout 25000ms exceeded`.
  - `curl -m 20 /` → `000` after 20.0 s.
  - Client navigation to `/bundles` stayed on the skeleton.
  - After `SIGCONT`, SSR returned 200.
- **Cause:** `shell/AppShell/AppShell.tsx:11-19` awaits `getCategories()` with no timeout, inside the `[locale]` layout that every route shares, sign-in included. The page readers in `api/server/catalogue.ts:19-46` and `api/server/updates.ts:15-24` have no timeout either. Only flags are protected (`lib/feature-flags/loadFlags.ts:13-16`, 500 ms).
- **Impact:** a Firestore latency spike or regional incident takes the whole site down as hanging requests instead of an error page. Nothing streams, not even `loading.tsx`, because the layout blocks first.
- **Fix:** add a shared `withTimeout(promise, ms)` for the server readers. The shell's categories should fall back to `[]` after about 1 s, as `loadFlags` does. Page reads should throw after a few seconds so that `error.tsx` renders.
- **Owner:** `shell/`, `api/server/`.

### M3 · The "Product updates" switch is saved but has no effect
- **Repro:** sign up, save `midjourney` (it has an update from 3 days ago), and see the bell badge "1". Go to Settings, turn **Product updates** off ("Show updates about the tools you follow in your notifications"), then return. The badge still says "1" and the panel still lists the update.
- **Evidence:** `node probe-prefs.cjs` → exit 0 (`prefs.out`): `stored prefs after toggle: {"productUpdates":false,…}; badge after turning it off: 1; panel items: 1`. `grep -rn productUpdates app/src` finds no consumer. `features/notifications/hooks/useNotifications.ts:14-33` never reads `prefs`.
- **Impact:** the setting does not do what it says. Users who opt out keep getting the badge.
- **Fix:** in `useNotifications`, when `profile.data?.prefs.productUpdates === false`, return no items and `newCount: 0`, or skip the feed query. Alternatively, mark the switch "Coming soon" as the email digest is.
- **Owner:** `features/notifications`.

### M4 · Signing out while a write is pending silently drops the write
- **Repro:** on a slow connection (or offline), click **Save** on a tool and post a review, then sign out within the latency window. Sign back in: neither the save nor the review exists.
- **Evidence:** `node probe-auth.cjs inflight` → exit 0 (`auth.out`):
  - `INFLIGHT slow: saved doc=false review doc=false …` (3 s write delay; sign-out 300 ms after the clicks).
  - `INFLIGHT offline … after re-sign-in: saved doc=false review doc=false`.
  - There is no error or warning in the UI. Before sign-out the optimistic UI showed both writes as done.
  - `features/auth/hooks/useSignOut.ts:5` and `features/auth/utils/authActions.ts:56` call `signOut` immediately. The Firestore SDK moves to a new user's mutation queue and never sends the old user's queued writes.
- **Impact:** a user who saves or reviews and then signs out, typically on mobile data, loses that work without any notice.
- **Fix:** in `signOutUser`, run `await Promise.race([waitForPendingWrites(clientDb()), timeout(3000)])` before `signOut`. Optionally show "Saving…" while waiting.
- **Owner:** `features/auth`.

### M5 · Every route ships the full Firebase Auth and Firestore SDK to visitors
- **Evidence:**
  - `node probe-jsweight.cjs` → exit 0 (`jsweight.out`). Script transfer on a cold visitor load: `/` 509 KB gz (1649 KB decoded), `/bundles` 504 KB, `/compare` 507 KB, `/sign-in` 522 KB, `/tools/midjourney` 532 KB. Firebase Auth and Firestore code is present on every route. On `/`, `/bundles`, `/compare` and `/sign-in` a visitor makes **0** Firestore requests.
  - One shared chunk, `.next/static/chunks/12hft7r6jh_st.js`, holds app, Auth and Firestore: **676 KB raw / 200 KB gz**.
  - `node bundle-size.cjs .next` lists the per-route client manifests: 740–824 KB gz each.
  - `next build` in Next 16 no longer prints per-route sizes, so these numbers come from the browser and the manifests.
- **Cause:** the shell imports `AuthListener` and the RTK endpoints statically, and the endpoints import `firebase/firestore` at module level (`lib/firebase/client.ts`).
- **Impact:** about 200 KB gz of parse and execute work on every first page view, for visitors who only need to know they are signed out. Firestore is only used on tool pages (reviews) and on signed-in pages.
- **Fix:** later, not tonight. Load `firebase/firestore` lazily (dynamic `import()` inside `clientDb()` and the endpoint `queryFn`s), or move the realtime endpoints behind a client-only boundary loaded when a signed-in user or a tool page needs them. Consider deferring the Auth SDK until idle.
- **Owner:** `lib/firebase`, `api/`, `shell/`.

---

## Minor

### m1 · Double-clicking "Delete review" shows a false "You don't have permission to do that." and briefly makes the local aggregate negative
- **Repro:** open your own review, click Delete, then double-click **Delete review** in the dialog.
- **Evidence:** `node probe-races.cjs 0` and `node probe-races.cjs 2000` → exit 0 (`races-0.out`, `races-2000.out`):
  - `REVIEW delete dblclick confirm: rating after={"count":0,"sum":0} review exists=false alerts=["You don't have permission to do that."]`.
  - The console shows `Dropped invalid document jasper`: the second batch's `increment(-1)` is applied locally, so the count goes to -1 and fails the schema until the server rejects it.
  - The confirm button is inside `DialogClose` and is never disabled (`features/reviews/components/DeleteReviewDialog/DeleteReviewDialog.tsx:39-47`). The close animation leaves it clickable.
- **Impact:** an error message after a delete that succeeded, plus a brief "No reviews" flicker. Data stays correct because the rules hold.
- **Fix:** make `useReviewWrites.remove` (or `useBatchAction.run`) a no-op while `pending`, and pass `disabled` to the confirm button.
- **Owner:** `features/reviews`.

### m2 · Admin "new tool": the form stays in create mode after saving, so a second save is blocked by a vague error while "Saved." is still shown. Slug uniqueness is a client-only check
- **Repro:** as admin, create a tool, see "Saved.", change the name and press Save again.
- **Evidence:** `node probe-admin-locale.cjs` → exit 0 (`admin-locale.out`): `2nd save from create form: name= Z1 Probe … errors visible: ["Check this field."] savedNotice= true`. The rename is not written, yet "Saved." stays visible.
- **Code:**
  - `features/admin/tool-form/ToolFormView.tsx:47-53` keeps `mode: 'create'`.
  - `components/ToolForm/ToolForm.tsx:45-46` sets an error of type `taken` with no message.
  - `api/endpoints/admin.ts:72` creates with `setDoc`, which overwrites an existing document because admin `update` is allowed.
  - `ready` (`ToolFormView.tsx:53`) does not wait for `useAdminToolsQuery`. If that list is slow or failed, `takenSlugs` is `[]`, and "create" on an existing slug replaces the tool. That resets `rating` to `{0,0}` while its reviews remain.
  - Bundles behave the same way (`BundleFormView.tsx:42-50`). Updates overwrite silently on the same version id (`UpdateFormView.tsx:27`).
- **Fix:** after a successful create, `router.replace(routes.adminTool(slug))`. Gate `ready` on `tools.isSuccess`. Create through a lite `runTransaction` that aborts if the document exists. Add an `admin.form.slugTaken` message.
- **Owner:** `features/admin`.

### m3 · Google sign-in with an existing email-and-password address silently removes the password, and the conflict case has no recovery path
- **Repro:** sign up with email and password, sign out, then choose **Continue with Google** with the same address.
- **Evidence:** `node probe-google.cjs` → exit 0 (`google.out`). For both `@z1.test` and `@gmail.com`, Google sign-in succeeded with the same uid and the profile was kept. The emulator account then lists `providers= google.com passwordHash= false emailVerified= true`, and a later password sign-in fails with "That email and password don't match".
  - The app never calls `sendEmailVerification` (`grep` finds 0 matches). Firebase treats such accounts as unverified and replaces the password provider.
  - In production, non-Gmail addresses return `auth/account-exists-with-different-credential` instead. That maps to `accountExists` ("This email is already linked to another sign-in method", `features/auth/utils/authErrors.ts:32`), with no hint about which method to use and no `linkWithCredential` flow.
- **Fix:** send a verification email on sign-up. On `accountExists`, call `fetchSignInMethodsForEmail` and tell the user to sign in with that method (optionally link afterwards).
- **Owner:** `features/auth`.

### m4 · A Google display name cut at 60 characters can split an emoji and is stored with "?"
- **Evidence:** `node probe-google-name.cjs` → exit 0 (`google-name.out`). The name `'a'×59 + '😀b'` was stored as `"aaa…a?"`. `features/auth/utils/profileSeed.ts:7` slices by UTF-16 units and keeps a lone high surrogate. `reviewAuthor.ts:22` already strips it.
- **Fix:** reuse the `clip` helper from `reviewAuthor.ts` (slice, then strip a trailing high surrogate) in `deriveDisplayName`.
- **Owner:** `features/auth`.

### m5 · Listener churn: one vote listener per review, and tool listeners stay open for 60 s after leaving the page
- **Evidence:** `node probe-listeners.cjs` → exit 0 (`listeners.out`). I counted `addTarget`/`removeTarget` frames on the Listen channel.
  - Signed in, after visiting 4 tool pages through client navigation: **20 open watch targets**. Each tool page leaves its rating, its reviews, and one `…/reviews/<author>/votes/<me>` target per review.
  - After 65 s idle: **3** (saved, profile, collections). There is no permanent leak, and no duplicate targets.
  - `api/endpoints/reviews.ts:88-125`: `toolRating`, `toolReviews` and `helpfulVote` use the default `keepUnusedDataFor` (60 s). `HelpfulButton` opens one `helpfulVote` listener per review, so a tool with N reviews opens N extra listeners (the reviews list is unpaginated, already known).
  - `api/endpoints/notifications.ts:113-140` registers a second `onSnapshot` on `users/{uid}/saved`, next to `myLibrary.savedIds` (`myLibrary.ts:65-83`). The SDK merges the watch target, but two caches and two callbacks are kept.
- **Fix:** set `keepUnusedDataFor: 5` on the three tool endpoints. Read vote state once (`getDoc`) and update it optimistically, rather than one listener per review. Let notifications reuse `useSavedIdsQuery`.
- **Owner:** `api/endpoints`, `features/reviews`, `features/notifications`.

### m6 · N+1 reads: the notification feed makes one `getDoc` per tool
- **Evidence:** `api/endpoints/notifications.ts:63-79,98-101`. After the chunked `in` query, every distinct tool in the feed is fetched with its own `getDoc` to get its name and logo. The module-level `toolCache` is never invalidated, so renamed tools or changed logos stay stale until reload. Server side, every page view reads the whole `tools` collection (`api/server/catalogue.ts:19-29`). That is the known C2 item and is not reported again.
- **Fix:** denormalise `toolName` and `logo` onto `updates/{id}` (the admin writes it), or take them from the published tool list the page already has.
- **Owner:** `api/endpoints`, `features/admin` (if denormalised).

### m7 · Error and 404 paths: unknown routes show Next's default English 404, and unknown slugs and error pages return HTTP 200
- **Evidence:** `node probe-sweep.cjs visitor` → exit 0 (`sweep-visitor.out`, `text/visitor_nonexistent_route.txt`):
  - `/bg/nonexistent-route` returns 404 with the body `404 This page could not be found.`. That is English, with no app shell. `app/[locale]/not-found.tsx` exists, but there is no `[locale]/[...rest]` catch-all to reach it.
  - `/tools/does-not-exist` and `/bundles/nope` render the localized not-found view with **200**. `noindex` is present, which softens the impact.
  - With Firestore down (`emu-term.out`), `/` and `/tools/jasper` render "Something went wrong" with **200**, and client navigation logs React #441 (RSC "Connection closed").
- **Fix:** add `app/[locale]/[...rest]/page.tsx` that calls `notFound()`. Call `notFound()` before any streaming boundary on slug pages, or move `loading.tsx` below the slug check, so the status is 404. Uptime checks should not rely on status codes for error pages.
- **Owner:** `app/[locale]`, `features/system`.

### m8 · i18n: English and unnatural strings in the BG UI
- **Tag chips:** the library tag filter shows raw English slugs in BG ("ai art", "coding", "copywriting", "image gen"…), from `features/library/utils/tagOptions.ts:17-18` and `components/LibraryFilters/LibraryFilters.tsx:33-35`. Evidence: `text/visitor_.txt`. Add a tag label map in `messages/*/library.json`.
- **Plural agreement:** `messages/bg/bundles.json:17`: `"{count, plural, one {# инструмент} …} включени"` renders "1 инструмент включени". Use `one {# включен инструмент} other {# включени инструмента}`, as `detail.included` already does.
- **Missing plurals:** `compare.values.trialDays` ("{days} days" / "{days} дни") and `library.card.trial` in bg ("{days} дни пробен период") give "1 days" and "1 дни". Use ICU plurals.
- **Mixed register:** `compare.json` uses the informal "Избери", "Търси", "Виж", "Сравни", and `bundles.section.seeAll` / `account.profile.reviews.viewTool` use "Виж". Everything else uses the polite "Изберете" / "Въведете".
- **Inconsistent terms:**
  - "Ревюта" (profile stats and titles) vs "Отзиви" everywhere else.
  - "тагове" (`shell.header.searchPlaceholder`) vs "етикети".
  - "Върви добре с" (`tool.complementary.title`) is a calque; "Работи добре с" is more natural.
  - "Подредете своя библиотека" (`auth.signUp.subtitle`) should be "своята".
- **Currency and dates:**
  - Currency renders as CLDR "10 щ.д." and "От 10 щ.д./мес." (`lib/format/money.ts`). This is correct, but `currencyDisplay: 'narrowSymbol'` ("10 $") reads more naturally to BG users. Product call.
  - Dates render correctly ("17.10.2026 г.").
  - No `timeZone` is configured for next-intl (`i18n/request.ts`), so server-rendered update dates use the server's time zone (UTC on App Hosting) while review dates use the browser's.
- **Owner:** `messages/`, `features/library`, `i18n/`.

### m9 · The slug schema has no maximum length, but the collection rules cap entries at 64 alphanumerics
- **Evidence:** `packages/schemas/src/common.ts:7` (`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, no `.max`) vs `firebase/firestore.rules:194-243` (`{0,63}` units). An admin can create a valid tool whose slug is longer than 64 characters with no hyphens. Adding that tool to a collection is then denied by the rules, and the user sees a "permission" error. This is the reverse of the known R2 item.
- **Fix:** `slugSchema.max(64)`, or an admin-form-only maximum.
- **Owner:** `packages/schemas`.

### m10 · Production environment footgun: emulators are on by default
- **Evidence:** `app/src/config/env.ts:23-26`. `NEXT_PUBLIC_USE_EMULATORS` defaults to `'true'`, and the API key and project default to the demo values. A production build without these variables would point browsers at `127.0.0.1:8080/9099` instead of failing the build. Deploy prep (H3) is deferred, so this is a reminder for H3.
- **Fix:** default to `false` when `NODE_ENV === 'production'`, or fail the schema in production when it is unset.
- **Owner:** `config/`.

---

## Checks per hunt area (including "found nothing")

1. **Writes the rules reject in real use.** I read every `setDoc`, `updateDoc`, `addDoc`, `deleteDoc`, `writeBatch` and `runTransaction` call (myLibrary, profile, notifications, bundleInterest, reviewBatch, admin lite writes) against `firestore.rules`.
   - Exercised in the browser: save and unsave, collection create, review create, edit, delete and double submit, vote, notify me, mark all read, display name, prefs, the locale write, and admin create and edit. All were accepted, and the aggregates stayed exact.
   - Rejections found only under races: m1 and m9.
   - Collection names are trimmed by zod before the write. Review edits with an unchanged rating skip the tool update, as `ratingMovedBy(0,0)` needs. Firestore indexes cover the notifications `in` + range + `orderBy`, the profile `authorUid` + `updatedAt`, and the count query (`firestore.indexes.json`). Nothing else found.
2. **Client-trusted values and authorization gaps:** M1 (review author fields), M3 (UI promises a preference that nothing enforces).
   - Admin pages are gated by `admins/{uid}`, and every admin write needs `isAdmin()`.
   - `bundleInterest` collection-group reads are admin only.
   - JSON-LD escapes `<` (`lib/seo/jsonLd.ts:59`).
   - Nothing else found.
3. **Listener leaks and duplicates:** m5. Every `onCacheEntryAdded` awaits `cacheEntryRemoved` and unsubscribes. The early `cacheDataLoaded` rejection path returns before subscribing. `onAuthStateChanged` is cleaned up by its effect. No permanent leak: after a full signed-in tour, 65 s idle brought the targets back to 3. No duplicate watch targets on the network (`listeners.out`).
4. **Auth edge cases:**
   - **Two tabs:** signing out in tab A moved tab B from `/library` to `/`, and tab C's tool page showed "Sign in". No console errors (`auth.out`). Nothing found.
   - **Sign-out with writes in flight:** M4.
   - **Session expiry:** disabled user plus an expired persisted token, and deleted user plus an expired token. On reload, the SDK refresh failed (one 400 in the console) and the user landed on `/sign-in?next=%2Flibrary`. No crash. The `userDisabled` copy is never shown on this path. That is cosmetic and not filed.
   - **Google with the same email:** m3.
5. **Races and idempotency** (`races-0.out`, `races-2000.out` with a 2 s write delay via `page.route`, `admin-locale.out`, `prefs.out`):
   - Double-clicking save toggles twice and ends in a consistent unsaved state.
   - Double-clicking collection create made 1 collection. Double-clicking review submit made 1 review (+1/+4). Double-clicking vote made 1 vote (+1). Double-clicking notify me made 1 document. Double-clicking mark all read gave no error.
   - Save followed by immediate Back still committed. Back and forward kept the saved state.
   - Switching the locale BG then EN within 300 ms, with and without a 2.5 s write delay, ended in a consistent URL, `lang` and `profile.locale`, with no bounce after reload.
   - Admin double-clicking save made 1 write.
   - Issues found only in delete review (m1) and admin re-save (m2).
6. **SSR and hydration** (`sweep-*.out`: 104 visitor, 96 member and 48 admin page loads across 375 and 1280 and en and bg; `cold-*.out`): B1. Otherwise there were no console errors or warnings on any route signed in or out, apart from the 404 resource line on unknown routes (m7).
7. **i18n:** m8 and m7 (English 404). The en and bg catalogues have identical keys (INV-15). The only strings identical to English are language names, the brand and numeric templates.
8. **Performance:**
   - M5: Firebase SDK sent to visitors, about 500 KB gz of JS per route.
   - m5 and m6: N+1 listeners and reads.
   - The library page opens no per-card listeners: a signed-in user on `/` has 3 targets.
   - Server per-request full-catalogue reads are known (C2).
9. **Error states:**
   - Firestore hung: M2.
   - Firestore stopped: error boundary returned with 200, and #441 on client navigation (m7).
   - Client offline (`offline.out`): save, review and collection were queued optimistically and **all committed** once back online.
     - While offline the new-collection dialog spinner never stops, and nothing tells the user they are offline. That is a minor UX gap, not filed separately.
     - Client navigation offline falls back to browser navigation and fails, which is expected without a service worker.

---

## Fix tonight (each safe in under 30 minutes)

1. **B1:** gate auth status behind `useHydrated()` centrally in `features/auth/hooks/useCurrentUser.ts` (or in `ReviewComposer`, `HelpfulButton` and `NotifyMeButton`). Re-run `probe-cold.cjs visitor` and expect 0/30.
2. **M3:** honour `prefs.productUpdates` in `features/notifications/hooks/useNotifications.ts` (empty feed and `newCount 0` when false).
3. **M4:** `await Promise.race([waitForPendingWrites(clientDb()), timeout(3000)])` before `signOut` in `features/auth/utils/authActions.ts:56`.
4. **M2 (shell part):** wrap `getCategories()` in `shell/AppShell/AppShell.tsx` with the same timeout fallback as `loadFlags`, so auth and other pages can still stream. Page readers can follow later.
5. **m1:** ignore `remove` while `pending` in `useReviewWrites`, and disable the dialog's confirm button.
6. **m4:** reuse `clip()` from `reviewAuthor.ts` in `profileSeed.deriveDisplayName`.
7. **m2:** after a successful create, `router.replace(routes.adminTool(slug))` (and the bundle equivalent). Gate `ready` on `tools.isSuccess`. Add a `slugTaken` message.
8. **m8 (catalogue part):** fix `bundles.card.toolsIncluded` agreement, add ICU plurals to `trialDays` and `card.trial` (en and bg), and unify the "Избери/Виж" register in `compare.json`.
9. **M1 (rules part, about 30 minutes with tests):** restrict `authorPhotoUrl` to `null` or an allow-listed `https://` host in `isValidReview`, align `reviewSchema`, and add two rules tests.
