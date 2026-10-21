**Template:** brief-v1 · **Task:** Z2a · **Phase:** 6 · **Model:** sonnet · **Base sha:** 267d8a0

# Z2a — Fix lane: hydration, console, 404, tokens, tool, reviews, shell

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first, including every rule at its end. It is binding.
The QA report is `~/Repos/ai-explore/artifacts/qa/report.md`. Item IDs below refer to it. Q1's screenshots are on branch
`overnight/Q1`: `git show overnight/Q1:artifacts/qa/<file> > /private/tmp/claude-501/-Users-lyubomirpacheliev-Repos/2e8f8632-1631-4bdf-86fc-8963a365ab88/scratchpad/<file>`, then view it.
All 26 INVs are green on trunk and must stay green. The manager may send you a second batch from the release audit (Z1). Fold it in.
Gate: `scripts/gate.sh --full --task Z2a --base 267d8a0` → `GATE PASS`, with an empty pending list.
Hand-back: `~/Repos/ai-explore/prompt/overnight/tasks/Z2a/handback.md`, from the template, listing each item as fixed or skipped with the reason.
Never touch `app/src/features/account/delete/**`, `app/src/features/auth/hooks/useEnsureProfile.ts` or `app/src/features/account/settings/SettingsView.tsx`. U3 owns them.

## Items
1. **B1** (blocker): React #418 on `/tools/*` and `/bundles/*` for every fresh visitor.
   - Fix it once for every consumer. Preferred: `app/src/api/StoreProvider.tsx` keeps the pristine initial state and passes
     `serverState` to `<Provider>`. Otherwise gate `useCurrentUser` behind a shared hydrated flag.
   - Prove it: load `/`, `/tools/midjourney`, `/tools/jasper`, `/bg/tools/midjourney`, `/bundles/startup-founder-pack`,
     `/compare?a=midjourney&b=stable-diffusion` and `/sign-in` **6×** each in a fresh context at 375 and 1280.
     That must give 0 pageerrors and 0 hydration warnings.
2. **INV-20 flake.** The live rating summary (features/reviews, `api/endpoints/reviews.ts`) must show only
   **server-confirmed** aggregates, i.e. ignore snapshots with `metadata.hasPendingWrites`. The value it shows must already
   be committed, so navigating to the server-rendered library right after shows the same number. Repeat INV-20 10× green.
3. **M7:** `useNow()` for `relativeTime` in `NotificationItem`, so there are no console errors.
4. **M1:** `app/src/app/[locale]/[...rest]/page.tsx` → `notFound()`, plus a root `app/src/app/not-found.tsx` (`lang`,
   dark tokens, link home), so every unknown URL gets the dark, translated 404. **m12:** the not-found view gets a
   "Back to the library" button, a centred block and a "Page not found" title.
5. **M8:** raise `--color-text-subtle` (`packages/ui/src/tokens/tokens.css`) to about `oklch(0.66 0.014 265)`. Re-check contrast.
6. **M2:** tag chips on the tool page that link to `routes.libraryWith({ tags: [tag] })`. **M9:** "Contact sales" becomes a real
   external link to `websiteUrl`. **m3:** "No reviews yet" wording, plus "(n)" after the header average.
   **m25:** drop `allowFullScreen`. **m9:** hide carousel arrows when nothing overflows (Carousel primitive).
7. **m13:** the share popover gets `collisionPadding={16}` and `align="start"`.
8. **Shell:**
   - **m26:** the locale switcher shows its label in the SSR HTML.
   - **m17:** hide the header search on the library route.
   - **m24:** hide the header "Sign in" on auth routes, add a show/hide password toggle, and pad inline auth links to 24 px or more.
9. **m21:** `TabsTrigger` uses a `focus-visible` inset ring.
10. **m5:** `formatCents` uses `currencyDisplay: 'narrowSymbol'`, so bg reads "65 $".
11. **Copy:** **m7** changes the bg email placeholder to "ime@primer.bg". **m4:** "Ревюта" → "Отзиви" in `auth.json` (not `account.json`).

## Scope
- `app/src/api/StoreProvider.tsx`, `app/src/api/endpoints/reviews.ts`, `app/src/app/not-found.tsx`;
- `app/src/app/[locale]/[...rest]/**` (new);
- `app/src/features/{notifications,system,tool,reviews,share,auth}/**` (auth minus `useEnsureProfile.ts`);
- `app/src/shell/**`, `packages/ui/**`, `app/src/lib/format/**`;
- `app/src/messages/{en,bg}/{notifications,system,tool,reviews,share,auth,shell}.json`;
- `artifacts/screens/Z2a-*`.
