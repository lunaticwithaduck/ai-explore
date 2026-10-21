> **Manager note (saved 03:05):**
> - **Authorship:** Q1 wrote this report. The harness blocked the subagent from writing report files, so the manager saved
>   Q1's text verbatim below this note.
> - **Screenshots:** the 195 `Q1-*.png` captures (20 MB) stay on branch `overnight/Q1` (commit 89b85d2) and are not
>   merged into trunk, to keep the repo small. Use `git show overnight/Q1:artifacts/qa/<file>` or check out that branch.
>   `Q1-console-errors.tsv` is merged.
> - **Base:** Q1 audited `20ce5be`, before H1 merged (ce533a1). H1 has since fixed **B2** (no `aria-pressed` on the
>   signed-out save link), **m23** (menus are `modal={false}`), heading-order, and part of **M8** (text-subtle →
>   text-muted in menus and notifications). INV-25 is green on trunk.
> - **Next:** the remaining items are assigned to the fix lanes Z2a, Z2b and Z2c.

# Q1: visual and UX QA report

Read-only review of the whole app at base `20ce5be`, written as the work list for H1.

- **Build:** `next build` with the SLOT 3 env, served by `next start -p 3003` inside `scripts/emulators-exec.sh`, after `scripts/seed.sh`.
- **Browser:** Playwright Chromium (headless), viewports 375×812 and 1280×800 at DPR 1, full-page shots unless the state is an overlay.
- **Locales:** every route in `en`. bg spot checks cover library, tool, bundles, bundle detail, compare, sign-in, sign-up, 404, share, and the signed-in pages (signed up from `/bg/sign-up`, so the profile locale is `bg`).
- **Accounts:** fresh users signed up through the UI, plus `E2E_ACCOUNTS.member` (notifications) and `E2E_ACCOUNTS.admin` (admin).
- **Per capture:** console errors and warnings, page errors, failed requests and 4xx/5xx responses, axe (wcag2a/aa, 2.1, 2.2), horizontal-overflow and off-screen checks, tap targets, truncation. bg pages also list Latin text left in the UI.
- **Hydration:** each route loaded 6× in a fresh browser context per width, as a separate check, for a reliable verdict.
- **Diffs:** a temporary `next dev` on the same slot port, to read the React hydration diffs that the production build minifies.

All screenshot paths below are relative to `artifacts/qa/` on branch `overnight/Q1`. The per-page error log is `Q1-console-errors.tsv`.

**Severity**
- **blocker:** hydration error, or an INV that fails as the app stands.
- **major:** visibly broken layout or content, a dead or misleading control, a SPEC §3, §8 or §9 requirement not met, or an a11y failure axe rates serious.
- **minor:** polish, copy, consistency.

**Counts:** 2 blockers · 13 majors · 30 minors.

---

## Findings

| ID | Sev | Route | Viewport | Locale | Screenshot | What is wrong | Expected | Suggested fix | Owner |
|---|---|---|---|---|---|---|---|---|---|
| B1 | **blocker** | `/tools/[slug]`, `/bundles/[slug]` | 375, 1280 | en, bg | `Q1-tool-midjourney-375.png`, `Q1-share-copied-1280.png`, `Q1-share-open-375-bg.png` | **React #418 hydration mismatch on every first visit** (6/6 fresh loads per route and width; see the hydration table). React dev diff: **`ReviewSignInPrompt`** is server-rendered as the pulse skeleton (`animate-pulse … h-40`, auth `loading`), but the client's first render draws the sign-in prompt. **`NotifyMeButton`** is server-rendered as a button, but the client renders `<a href="/sign-in?next=…">`. The auth listener resolves to `signedOut` before the streamed page segment (under `loading.tsx`) hydrates, and `useSelector` reads that live store value during hydration. | No hydration warnings (brief). U1 already fixed the same issue in my-library with `useHydrated`. | One fix for all consumers: in `app/src/api/StoreProvider.tsx` keep the pristine state (`const [initial] = useState(() => store.getState())`) and render `<Provider store={store} serverState={initial}>`. Hydration then reads `loading` and re-renders after. Alternative: move `features/my-library/hooks/useHydrated` to `lib/` and gate `useCurrentUser` on it, so it returns `loading` until hydrated. | `api` (StoreProvider) / `features/auth`; affected: `features/reviews`, `features/bundle-interest` |
| B2 | **blocker** | `/`, `/?…` filters, `/tools/[slug]`, share popover | 375, 1280 | en, bg | `Q1-library-1280.png`, `Q1-tool-midjourney-1280.png` | axe **critical** `aria-allowed-attr`: for visitors, `SaveToolButton` renders an `IconButton asChild` **link** with `aria-pressed="false"` (8 nodes on `/`, 1 on each tool page). This fails INV-25 (library, tool) as soon as it is un-fixme'd. | INV-25: no serious or critical axe violations on library, tool, bundle, compare, settings. | In the `signedOut` branch, don't pass `aria-pressed` (a link is not a toggle). Keep it only on the signed-in `<button>`. | `features/my-library` (SaveToolButton) |
| M1 | major | any unknown URL, e.g. `/this-page-does-not-exist`, `/bg/anything` | 375, 1280 | en, bg | `Q1-404-1280.png`, `Q1-404-375-bg.png` | Unmatched URLs fall through to **Next's default white 404**: no app shell, light theme, untranslated "This page could not be found.", no link home, and `<html>` without `lang` (axe `html-has-lang` serious). `/bg/anything` is identical: only `notFound()` calls inside `[locale]` reach `[locale]/not-found.tsx`. | Dark theme (ruling 1), and the app's own `NotFoundView` (as in `Q1-404-tool-1280.png`). | Add `app/src/app/[locale]/[...rest]/page.tsx` calling `notFound()`. Add a root `app/src/app/not-found.tsx` (html `lang="en"`, globals, dark tokens, link to `/`) for paths whose first segment is not a locale, or let the middleware rewrite those to the default locale. | `app` routes, `features/system` |
| M2 | major | `/tools/[slug]` | 375, 1280 | en, bg | `Q1-tool-midjourney-1280.png` | The tool page shows **no tags**: `ToolHeader` and `ToolDetailView` never render `tool.tags`. | SPEC §3: "Tool page: header, Open, **tags**, plans, …". The prototype `ToolDetail.tsx` has a Tags block. | Render tag chips under the tagline in `ToolHeader`, each linking to `routes.libraryWith({ tags: [tag] })`. | `features/tool` |
| M3 | major | `/`, `/library`, `/bundles/[slug]` (tool list) | 1280 (and 2-col widths) | en, bg | `Q1-library-1280.png`, `Q1-my-library-1280.png`, `Q1-bundle-detail-1280.png` | Card footers are not uniform. The price row is 24, 44, 48 or 72 px tall depending on the tool: a trial badge pushes the rating to a 2nd line, MidJourney and Tableau stack price, trial and rating on 3 lines, and Jasper wraps "No reviews yet". In row 1 the price text sits at y=545 (Runway, Copilot) but y=569 (ElevenLabs, ChatGPT); row 2 is at 755, 783 and 803 (measured). INV-26 passes (bottom edges match), but the cards look ragged and not compact. | Ruling 4: price and rating pinned to the bottom, cards compact. Prototype `ToolCard.tsx`: one line, price plus a small "14d trial" left and reviews right. | Keep the footer to one `flex-nowrap` line: price, a compact muted trial ("14-day trial", `text-xs`, no pill, or move the trial pill to the header row next to the category), and the rating right-aligned. Or use a fixed 2-row footer grid that always reserves the meta row. | `features/catalogue` (ToolCard) |
| M4 | major | `/bg/bundles/[slug]` | 375 | bg | `Q1-bundle-detail-375-bg.png` | The CTA label "Влезте, за да бъдете уведомени" fills the full-width button edge to edge: no side padding, the bell icon touching the left edge, and the text clipped on the right. | No overflow or clipping at 375 (H1 brief). | Let `Button fullWidth` wrap (`whitespace-normal h-auto py-2 text-center`) or keep side padding with a min. Shorten the bg string, e.g. "Влезте за известие". | `features/bundle-interest`, `messages/bg/bundleInterest.json`, `packages/ui` (Button) |
| M5 | major | `/library?collection=…` | 375 | bg (en degraded) | `Q1-my-library-collection-375-bg.png`, `Q1-my-library-collection-375.png` | In the collection header, the Rename and Delete buttons squeeze the title: in bg "Писане и маркетинг" collapses to "П. / и / м." (one ellipsised letter per line), and "1 инструмент" wraps. In en the title wraps to 2 lines. | Legible titles at 375. Prototype `Sidebar.tsx` and `Profile.tsx` show collection names in full. | At `<sm`, stack the actions under the title (`flex-col sm:flex-row`) or use icon-only buttons with labels. Title: `min-w-0 flex-1 line-clamp-2`. | `features/my-library` (CollectionHeader) |
| M6 | major | `/compare?a=&b=` | 375 | en, bg | `Q1-compare-375.png`, `Q1-compare-chatgpt-375.png` | The comparison table is 407 px wide inside a 341 px card. The second tool's column is cut off ("Stable Dif…", "Open So…") and only reachable by an undiscoverable horizontal scroll. | SPEC §6 side-by-side table, with no hidden overflow at 375. | At `<sm`, give each row label its own full-width line with the two values in a 50/50 grid below, and keep the two tool headers in a 2-col sticky header. Or keep the scroll but add a sticky first column and a scroll shadow. | `features/compare` (CompareTable) |
| M7 | major | every page with the bell open (signed in) | 375, 1280 | en, bg | `Q1-notifications-open-1280.png`, `Q1-member-notifications-375.png` | `console.error` **next-intl `ENVIRONMENT_FALLBACK`**: "The `now` parameter wasn't provided to `relativeTime` …", logged on every render of every `NotificationItem` (dev stack: `NotificationItem → relativeTime`). It also risks SSR and CSR mismatches. | No console errors. | In `NotificationItem`, use `const now = useNow({ updateInterval: 60_000 })` and `format.relativeTime(date, now)`, or provide a global `now` in the intl provider. | `features/notifications` |
| M8 | major | dropdowns, popovers, notification rows | 375, 1280 | en, bg | `Q1-add-to-collection-empty-1280.png`, `Q1-notifications-open-1280.png` | Token contrast fails AA. `text-subtle` (#82868f) on `surface-raised` (#1e2026) is 4.46:1 (the "YOUR COLLECTIONS" label, "You have no collections yet.", timestamps). On the accent-tinted "new" notification row (#1f2b51) it is 3.78:1. axe rates color-contrast serious. | WCAG 1.4.3 (4.5:1). Settings is an INV-25 page and uses raised surfaces. | Raise `--color-text-subtle` from `oklch(0.62 …)` to about `oklch(0.66 0.014 265)` (≈#9296a0): 5.5:1 on surface-raised and 4.7:1 on the tinted row, still darker than `text-muted`. | `packages/ui` (tokens.css) |
| M9 | major | `/tools/jasper` (any custom-price plan) | 375, 1280 | en, bg | `Q1-tool-jasper-1280.png` | "Contact sales" is accent-coloured, link-styled **text** that is not interactive: a dead click. | No dead clicks (brief). | Make it a `TextLink` to `tool.websiteUrl` (`target="_blank" rel="noopener noreferrer"`, external icon), or render it as muted plain text. | `features/tool` (PlanCard) |
| M10 | major | `/admin` → Updates tab | 375, 1280 | en | `Q1-admin-updates-1280.png` | The Updates tab only offers "+ New update". There is no list of existing updates, no edit, no publish toggle. | SPEC §8: "/admin lists tools, bundles and updates, with create, edit and publish toggles". | List updates (collection group, newest first) with tool, version, kind and date, plus edit. | `features/admin` |
| M11 | major | `/admin/tools/new`, `/admin/tools/[slug]` | 375, 1280 | en | `Q1-admin-new-tool-1280.png`, `Q1-admin-edit-tool-1280.png` | The tool form has no tutorials, no comparison data (API access, integrations, speed, quality, best use case) and no similar or complementary tools. A tool created by an admin therefore has 0 tutorials, empty compare rows, and no "Similar" or "Works well with" sections. | Ruling 9 (≥4 tutorials per tool), ruling 11, SPEC §6 rows, SPEC §8 (same zod schemas as the seed). | Add repeater sections for tutorials (youtubeId, title en/bg, minutes, difficulty), a comparison fieldset, and tool multi-selects for similar and complementary. | `features/admin` |
| M12 | major | `/admin/tools/new`, `/admin/bundles/new` | 375, 1280 | en | `Q1-admin-new-tool-errors-1280.png` | Every validation error says "Check this field." No field has a format hint or placeholder (slug, website, logo path `/logos/x.png`, background `#RRGGBB`, prices in cents), so an admin cannot tell what is expected. | Specific, translated errors (CLAUDE.md errors rule). | Map zod issues to per-field messages (required, slug pattern, URL, hex colour, logo path) and add helper text. Consider entering prices in dollars and converting to cents in one place. | `features/admin`, `messages/*/admin.json` |
| M13 | major | `/` | 375 | en, bg | `Q1-library-375.png` | The filter chrome stacks search, price select, sort select, 7 category chips (3 rows) and 14 tag chips (4 rows). The first tool card starts at **y=660** in an 812 px viewport, so a visitor sees almost no results above the fold. | Prototype `Library.tsx`: sort and tags sit behind a "Filters" toggle with an active count. | At `<sm`, collapse price, sort and tags into a "Filters" disclosure or sheet with an active-filter count, and make the category chips one horizontally scrollable row. | `features/library` |
| m1 | minor | `/` | both | en, bg | `Q1-library-1280.png`, `Q1-library-1280-bg.png` | The bundles section is titled "Curated collections" / "Подбрани колекции", while the sidebar and page say "Bundles" / "Пакети", and users also have personal "collections". One word, two meanings. | SPEC §3 "Bundles section"; prototype `BundlesSection`. | Title it "Bundles" / "Пакети" and keep the subtitle. | `features/bundles`, `messages/*/bundles.json` |
| m2 | minor | `/`, `/bundles`, compare, bundle detail | both | all | `Q1-bundles-1280.png` (avatar stacks), `Q1-library-375.png` | ChatGPT's logo tile background `#1A1A1A` is almost the card surface, so the tile edge disappears. The glyph is about 16 px inside a 48 px tile because the PNG is heavily padded, and in avatar stacks it reads as a floating speck. (The follow-up crop list covers runway, elevenlabs, tableau and jasper, not chatgpt.) | Rulings 2 and 3: real logo, contrasting per-tool background, contained. | Crop `public/logos/chatgpt.png` to the mark and use a contrasting `logo.background` (white or OpenAI green). Optionally add a 1 px `border` token to `ToolLogo` for dark tiles. | `firebase/seed`, `app/public/logos`, `packages/ui` (ToolLogo) |
| m3 | minor | `/tools/[slug]` | both | en | `Q1-tool-jasper-1280.png` | The header says "No ratings yet" while cards and the reviews section say "No reviews yet" for the same state. The header average shows no review count. | INV-16 wording ("No reviews yet"); prototype shows "★ 4.5 (2)". | Reuse the "No reviews yet" key and append "(n)" after the average. | `features/tool`, `messages/*/tool.json` |
| m4 | minor | `/tools/[slug]` vs `/profile` | both | bg | `Q1-review-posted-375-bg.png`, `Q1-profile-1280-bg.png` | bg uses "Отзиви" on the tool page but "Ревюта" in profile stats, "Последни ревюта", and the sign-in subtitle. | Consistent terminology. | Use "Отзиви" everywhere in `account.json` and `auth.json`. | `messages/bg` |
| m5 | minor | all prices | both | bg | `Q1-library-1280-bg.png` | USD is formatted as "65 щ.д." and "От 10 щ.д./мес.". The "щ.д." abbreviation is unfamiliar to most Bulgarian readers. | Clear price copy (SPEC Money: locale-aware formatting in one module). | Use `currencyDisplay: 'narrowSymbol'` in `lib/format/money.ts` ("65 $"), or show "$65" in bg as well. | `lib/format` (money.ts) |
| m6 | minor | library hero, titles | both | bg | `Q1-library-1280-bg.png` | bg mixes "AI" ("Вашата библиотека с AI инструменти") and "ИИ" ("ИИ пакет за …", "ИИ платформа"). | Consistent terminology. | Pick one (the bundles and tool data use "ИИ") and align the catalogue strings and seed bg text. | `messages/bg`, `firebase/seed` |
| m7 | minor | `/sign-in`, `/sign-up` | both | bg | `Q1-sign-up-errors-375-bg.png` | The email placeholder "vie@primer.bg" (transliterated "вие") reads awkwardly. | Natural bg copy. | Use "ime@primer.bg" or keep "name@example.com". | `messages/bg/auth.json` |
| m8 | minor | `/bg/tools/jasper` dialog | 375 | bg | `Q1-new-collection-dialog-375-bg.png` | The new-collection placeholder is cut off ("Например: Инструменти за дизаі"). | No truncated copy at 375. | Shorter placeholder, e.g. "напр. Дизайн". | `messages/bg/myLibrary.json` |
| m9 | minor | `/tools/midjourney`, `/tools/jasper` | both | all | `Q1-tool-midjourney-1280.png` | "Similar tools" shows both carousel arrows, disabled, when there is a single card. | Ruling 11 carousel; no dead controls. | Hide the arrows when the content does not overflow (`canScrollPrev` and `canScrollNext` both false). | `features/tool` (ToolSimilar) / carousel primitive |
| m10 | minor | `/compare?a=midjourney&b=stable-diffusion` | both | en, bg | `Q1-compare-1280.png` | "From price: **Not listed**" for a free-only tool, while that tool's card says "Free". | Consistent pricing copy. | When `hasFreePlan` and there is no paid plan, show "Free"; otherwise "—". | `features/compare` |
| m11 | minor | `/compare` | both | en | `Q1-compare-empty-1280.png` | With no params the page is two "Choose a tool" pickers over empty space. | Helpful empty state. | Add a one-line hint or a few popular pairs (e.g. each tool's first similar tool). | `features/compare` |
| m12 | minor | `/tools/not-a-real-tool` | both | en, bg | `Q1-404-tool-1280.png` | The not-found view has no call to action and the text block is off-centre. The document title is just "AI Explore". The response is HTTP 200 with `noindex` (a soft 404 from streaming under `loading.tsx`). | Prototype `ToolDetail.tsx`: "Tool not found" plus a "Back to Library" button. | Add a primary "Back to the library" button, centre the block, and make `generateMetadata` return a "Page not found" title. Accept the streamed 200, or resolve the tool before the Suspense boundary for a real 404. | `features/system`, `app/[locale]/(public)/tools/[slug]` |
| m13 | minor | `/tools/[slug]` share | 375, 1280 | all | `Q1-share-open-375.png`, `Q1-share-copied-1280.png` | At 375 the popover touches the left screen edge (no collision padding). At 1280, `align="end"` makes it grow leftwards over the sidebar. | Ruling 10 (share), visual polish. | Use `collisionPadding={16}` and `align="start"` on the share `PopoverContent`. | `features/share` / `packages/ui` (Popover) |
| m14 | minor | `/tools/[slug]` | both | all | `Q1-tool-saved-1280.png` | On the tool page, Save is a bare ghost heart next to outlined "Share" and "Compare" buttons. The saved state is only a filled heart, with no "Saved" label. | Prototype `ToolDetail.tsx`: a labelled "Save"/"Saved" toggle. | On the tool page, render a labelled secondary toggle ("Save"/"Saved"). Keep the icon-only version on cards. | `features/my-library` (SaveToolButton) |
| m15 | minor | `/bundles/[slug]` | both | all | `Q1-bundle-detail-1280.png`, `Q1-bundle-detail-yearly-1280.png` | The main price has no period suffix ("$69", "$699"). Only yearly adds "$58.25 per month". | Clear period pricing (SPEC §10). | Append "/mo", "/quarter" or "/yr" to the main price. | `features/bundles` |
| m16 | minor | `/?…` with filters | both | all | `Q1-library-tags-1280.png`, `Q1-library-filtered-1280.png` | With active tag, price or category filters there is no "Clear filters" control except in the empty state, and the Bundles section keeps rendering below filtered results. | Prototype `Library.tsx`: "Clear All" in the filter panel; bundles hidden while filtering. | Show a "Clear filters (n)" chip when any filter is active, and hide the bundles section while filtering. | `features/library` |
| m17 | minor | `/` | 1280 | all | `Q1-library-empty-search-1280.png`, `Q1-header-search-result-1280.png` | Two search boxes on the library page (header and hero) that are not synced. With `?q=zzqxv` the header stays empty. | One clear search; ruling 8 (search input). | Hide the header search on the library route, or bind both to the URL `q`. | `shell` (HeaderSearch) |
| m18 | minor | `/admin/tools/new`, `/admin/bundles/new` | 1280 | en | `Q1-admin-new-tool-1280.png`, `Q1-admin-new-bundle-1280.png` | The extra Slug field shifts the 2-column grid, so the EN/BG pairs zig-zag (Tagline EN right, Tagline BG on the next row left, and so on). The edit form, without the slug, pairs correctly. | Consistent paired fields. | Give Slug its own full-width row (`col-span-2`). | `features/admin` |
| m19 | minor | `/admin` → Interest | both | en | `Q1-admin-interest-1280.png` | Rows show bundle **slugs** ("ai-sdr-bundle") rather than names, and the trailing total number has no label. | Readable admin copy. | Show `bundle.name` and label the total ("Total"). | `features/admin` |
| m20 | minor | `/admin` lists | both | en | `Q1-admin-tools-375.png` | The "Edit" links are 26×20 px, below the 24 px minimum target height. | WCAG 2.5.8. | Make the whole row the link, or use a `size="sm"` button. | `features/admin` |
| m21 | minor | `/admin` tabs | both | en | `Q1-admin-updates-1280.png`, `Q1-admin-interest-1280.png` | Tab triggers show the focus ring after a **mouse** click, and the ring is clipped by the tablist border (a bracket-shaped artifact). | Ruling 8 spirit: a subtle focus-ring, visible for keyboard. | Use `focus-visible:` and an inset ring on `TabsTrigger`. | `packages/ui` (Tabs) |
| m22 | minor | `/` cards | both | all | `Q1-card-focus-1280.png` | When a card is focused, both the card ring and a clipped ring around the title link appear ("[Jasper AI]" artifact). | One clean focus indicator. | Suppress the inner link outline when the stretched link drives `focus-within` on the card. | `features/catalogue` (ToolCard) |
| m23 | minor | user menu, add-to-collection menu | both | all | `Q1-user-menu-1280.png`, `Q1-add-to-collection-menu-1280.png` | axe `aria-hidden-focus` (serious) while a Radix dropdown is open: the app is aria-hidden but still contains focusables. Not on an INV-25 page state. | Clean axe while menus are open. | `modal={false}` on these DropdownMenus, or accept and document it as a Radix pattern. | `packages/ui` (DropdownMenu) |
| m24 | minor | `/sign-in`, `/sign-up`, `/reset-password` | both | all | `Q1-sign-in-1280.png` | The header still shows "Sign in" on the auth pages. "Continue with Google" has no Google mark. Password fields have no show/hide toggle. The inline "Forgot password?" link is 16 px tall. | Polished auth (prototype `Settings.tsx` password eye). | Hide the header sign-in on auth routes, add the Google mark and an eye toggle, and pad the inline links to ≥24 px. | `shell` (AccountArea), `features/auth` |
| m25 | minor | `/tools/[slug]` tutorials | both | all | `Q1-tutorial-playing-1280.png` | `console.warning`: "Allow attribute will take precedence over 'allowfullscreen'". The click-to-load embed itself works (ruling 9, youtube-nocookie). | No console warnings. | Drop the `allowFullScreen` prop; keep `allow="…; fullscreen"`. | `features/tool` (TutorialItem) |
| m26 | minor | every page (SSR) | both | all | `Q1-tool-loading-1280.png` | The locale switcher renders **empty** in the server HTML (Radix `SelectValue` before mount), so on slow loads the header shows a blank select box. | Correct SSR chrome. | Render the current locale's label explicitly inside the trigger. | `shell` (LocaleSwitcher) |
| m27 | minor | `/profile` | both | all | `Q1-profile-1280.png` | In "Your collections" only the name text (100×18 px) is a link, although the whole card looks clickable. | Clear tap targets. | Make the card the link to `routes.myCollection(id)`. | `features/account` (ProfileCollections) |
| m28 | minor | `/library` empty | 1280 | en | `Q1-my-library-empty-1280.png` | The copy says "Tap the heart…" on desktop. | Device-neutral copy. | "Use the heart on any tool to keep it here." | `messages/en/myLibrary.json` |
| m29 | minor | any `/bg/...` link while signed in with locale `en` | both | bg | (observed: `/bg/profile` → `/profile`) | An explicit `/bg/...` URL is silently redirected to the profile locale, so a shared bg link opens in English for an en user. | SPEC §7: locale persists and redirects. A deliberate locale in the URL arguably wins. | Owner decision: honour the explicit URL locale (and offer to update the preference), or keep the redirect and show a small notice. | `features/auth` (useProfileLocaleSync) |
| m30 | minor | all bg pages | both | bg | `Q1-library-1280-bg.png` | `lang="bg"` turns on Inter's Bulgarian `locl` forms (д→ɡ-like, т→m-like: "Bugeo", "Bxog" look). This is a legitimate bg style, but it reads like a font switch mid-UI. | Owner design decision. | If unwanted, set `font-feature-settings: "locl" 0` for `:lang(bg)` in globals. | `packages/ui` (tokens/globals) |

---

## Hydration check (fresh visitor context, 6 loads per cell, production build)

| Route | 375 | 1280 |
|---|---|---|
| `/` | 0/6 | 0/6 |
| `/tools/midjourney` | **6/6 #418** | **6/6 #418** |
| `/tools/jasper` | **6/6 #418** | **6/6 #418** |
| `/bg/tools/midjourney` | **6/6 #418** | **6/6 #418** |
| `/bundles` | 0/6 | 0/6 |
| `/bundles/startup-founder-pack` | **6/6 #418** | **6/6 #418** |
| `/compare?a=midjourney&b=stable-diffusion` | 0/6 | 0/6 |
| `/sign-in` | 0/6 | 0/6 |
| `/library`, `/profile`, `/settings`, `/admin` (visitor, gated) | 0/6 | 0/6 |

The capture sessions reused one browser context per width, so #418 showed only on the first tool-page load: on
`Q1-tool-midjourney-375.png`, `Q1-share-open-375-bg.png` and `Q1-share-copied-*` in the per-page table below. The
fresh-context run above is the reliable signal: every new visitor hits B1.

---

## Coverage

All routes in the brief, at both widths.

**Visitor**

| Brief item | Screenshots (`375` and `1280`) |
|---|---|
| Library | `Q1-library-*`, `Q1-library-*-bg` |
| Filtered library | `Q1-library-filtered-*`, `Q1-library-tags-*`, `Q1-search-focus-*` |
| Empty search | `Q1-library-empty-search-*` |
| Tool: midjourney | `Q1-tool-midjourney-*`, `Q1-tool-midjourney-*-bg`, `Q1-tutorial-playing-*`, `Q1-tool-loading-*` |
| Tool: jasper | `Q1-tool-jasper-*` |
| Bundles | `Q1-bundles-*`, `Q1-bundles-*-bg` |
| Bundle detail | `Q1-bundle-detail-*`, `Q1-bundle-detail-*-bg`, `Q1-bundle-detail-yearly-*` |
| Compare | `Q1-compare-*`, `Q1-compare-*-bg`, `Q1-compare-empty-*`, `Q1-compare-picker-open-*`, `Q1-compare-chatgpt-*` |
| Share popover open | `Q1-share-open-*`, `Q1-share-open-*-bg`, `Q1-share-copied-*` |
| Sign-in | `Q1-sign-in-*`, `Q1-sign-in-*-bg`, `Q1-sign-in-error-*` |
| Sign-up | `Q1-sign-up-*`, `Q1-sign-up-*-bg`, `Q1-sign-up-errors-*`, `Q1-sign-up-errors-*-bg` |
| Reset password | `Q1-reset-password-*`, `Q1-reset-password-sent-*` |
| 404 | `Q1-404-*`, `Q1-404-*-bg`, `Q1-404-tool-*` |

**Signed in**

| Brief item | Screenshots (`375` and `1280`) |
|---|---|
| Header and user menu | `Q1-header-signed-in-*`, `Q1-user-menu-*`, `Q1-user-menu-*-bg`, `Q1-header-with-badge-*` |
| Mobile menu sheet | `Q1-mobile-menu-375`, `Q1-mobile-menu-375-bg` |
| Save a tool | `Q1-tool-signed-in-*`, `Q1-tool-saved-*` |
| Add-to-collection and new-collection dialog | `Q1-add-to-collection-empty-*` (+bg), `Q1-new-collection-dialog-*` (+bg), `Q1-new-collection-dialog-empty-submit-*`, `Q1-after-collection-create-*`, `Q1-add-to-collection-menu-*` |
| `/library` with a collection | `Q1-my-library-*` (+bg), `Q1-my-library-collection-*` (+bg), `Q1-my-library-empty-*`, `Q1-member-library-*`, `Q1-library-signed-out-*` (gate) |
| Notifications open | `Q1-notifications-open-*` (+bg), `Q1-notifications-read-*`, `Q1-notifications-empty-*`, `Q1-member-notifications-*` |
| Reviews | `Q1-review-empty-submit-*` (+bg), `Q1-review-compose-*`, `Q1-review-posted-*` (+bg), `Q1-tool-with-own-review-*`, `Q1-review-edit-*`, `Q1-review-delete-dialog-*` (+bg), `Q1-review-deleted-*` |
| Profile | `Q1-profile-*` (+bg), `Q1-profile-empty-*` |
| Settings | `Q1-settings-*` (+bg) |
| Other states | `Q1-bundle-notify-registered-*`, `Q1-after-sign-up-*`, `Q1-after-sign-out-*`, `Q1-locale-switcher-open-*`, `Q1-card-focus-*`, `Q1-header-search-result-1280` |

The mobile menu sheet is not applicable at 1280: the sidebar is persistent and the menu button is `lg:hidden`
(see `Q1-header-signed-in-1280.png`).

**Admin**

| Brief item | Screenshots (`375` and `1280`) |
|---|---|
| Dashboard tabs | `Q1-admin-tools-*`, `Q1-admin-bundles-*`, `Q1-admin-updates-*`, `Q1-admin-interest-*`, `Q1-admin-user-menu-*` |
| New-tool form | `Q1-admin-new-tool-*`, `Q1-admin-new-tool-errors-*`, `Q1-admin-edit-tool-*`, `Q1-admin-edit-missing-*`, `Q1-admin-new-bundle-*`, `Q1-admin-new-update-*` |
| 403 for a non-admin | `Q1-admin-403-*` (+bg), `Q1-member-admin-403-*` |

The admin bg captures were dropped, because the admin's profile locale is `en` and `/bg/admin` redirects to `/admin` (m29).

**Checks that passed (no finding)**
- Ruling 5: bare version labels "7.0" and "3.0".
- Ruling 6: the notification item badge says "New" / "Ново".
- Ruling 7: one `AccountBackButton` top-left on profile and settings, going back in history.
- Ruling 8: high-contrast search input text with a subtle ring.
- Ruling 9: the tutorials carousel shows a thumbnail first and a `youtube-nocookie` embed on click.
- Ruling 10: the share options are all 40 px in both the default and "Copied!" states, and the clipboard holds the URL.
- Ruling 11: both "Similar tools" and "Works well with" render.
- INV-22 UI: Notify me shows "You're on the list", and Subscribe is absent.
- Bundle period maths: yearly $699 against a $1,008 list, "Save 31%".
- No horizontal page overflow on any capture at 375.
- `lang` switches to `bg`.
- No untranslated chrome strings in bg. The only Latin text is data: tool, plan and author names, user reviews, and tag slugs.

**Known or in flight (not re-reported):** wordmark logo crops; 32 px chips and arrows; heading-order and
image-redundant-alt; the stale server-rendered header rating (V1); the empty "Danger zone" on Settings (U3, delete
account, is in flight in a sibling worktree).

---

## Console and page errors per page

The full per-screenshot list (195 rows) is `Q1-console-errors.tsv`. **145 captures had none**: no console error or
warning, no page error, no failed request, no 4xx/5xx response, and no axe serious or critical result. Every other
capture is below.

- `Failed to load resource: 404/400` are the browser's own messages for an intended 404 page and a wrong-password sign-in.
- `No available adapters.` comes from inside the YouTube iframe.

| Screenshot | URL | Console / page errors | axe serious+critical |
|---|---|---|---|
| Q1-404-1280-bg.png | `/bg/this-page-does-not-exist` | http.404: GET /bg/this-page-does-not-exist; console.error: Failed to load resource: 404 | html-has-lang (serious, 1) |
| Q1-404-1280.png | `/this-page-does-not-exist` | http.404: GET /this-page-does-not-exist; console.error: Failed to load resource: 404 | html-has-lang (serious, 1) |
| Q1-404-375-bg.png | `/bg/this-page-does-not-exist` | http.404: GET /bg/this-page-does-not-exist; console.error: Failed to load resource: 404 | html-has-lang (serious, 1) |
| Q1-404-375.png | `/this-page-does-not-exist` | http.404: GET /this-page-does-not-exist; console.error: Failed to load resource: 404 | html-has-lang (serious, 1) |
| Q1-add-to-collection-empty-1280-bg.png | `/bg/tools/jasper` | none | aria-hidden-focus (serious, 7); color-contrast (serious, 2) |
| Q1-add-to-collection-empty-1280.png | `/tools/jasper` | none | aria-hidden-focus (serious, 7); color-contrast (serious, 2) |
| Q1-add-to-collection-empty-375-bg.png | `/bg/tools/jasper` | none | aria-hidden-focus (serious, 6); color-contrast (serious, 2) |
| Q1-add-to-collection-empty-375.png | `/tools/jasper` | none | aria-hidden-focus (serious, 6); color-contrast (serious, 2) |
| Q1-add-to-collection-menu-1280.png | `/tools/jasper` | none | aria-hidden-focus (serious, 7); color-contrast (serious, 1) |
| Q1-add-to-collection-menu-375.png | `/tools/jasper` | none | aria-hidden-focus (serious, 6); color-contrast (serious, 1) |
| Q1-admin-user-menu-1280.png | `/` | none | aria-hidden-focus (serious, 1) |
| Q1-admin-user-menu-375.png | `/` | none | aria-hidden-focus (serious, 1) |
| Q1-library-1280-bg.png | `/bg` | none | aria-allowed-attr (critical, 8) |
| Q1-library-1280.png | `/` | none | aria-allowed-attr (critical, 8) |
| Q1-library-375-bg.png | `/bg` | none | aria-allowed-attr (critical, 8) |
| Q1-library-375.png | `/` | none | aria-allowed-attr (critical, 8) |
| Q1-library-filtered-1280.png | `/?category=image&sort=price-asc&price=free` | none | aria-allowed-attr (critical, 1) |
| Q1-library-filtered-375.png | `/?category=image&sort=price-asc&price=free` | none | aria-allowed-attr (critical, 1) |
| Q1-library-tags-1280.png | `/?tags=design,generation` | none | aria-allowed-attr (critical, 1) |
| Q1-library-tags-375.png | `/?tags=design,generation` | none | aria-allowed-attr (critical, 1) |
| Q1-member-notifications-1280.png | `/` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | color-contrast (serious, 1) |
| Q1-member-notifications-375.png | `/` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | color-contrast (serious, 1) |
| Q1-notifications-open-1280-bg.png | `/bg/library?collection=…` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | color-contrast (serious, 2) |
| Q1-notifications-open-1280.png | `/` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | color-contrast (serious, 2) |
| Q1-notifications-open-375-bg.png | `/bg/library?collection=…` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | color-contrast (serious, 2) |
| Q1-notifications-open-375.png | `/` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | color-contrast (serious, 2) |
| Q1-notifications-read-1280.png | `/` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | none |
| Q1-notifications-read-375.png | `/` | console.error: next-intl ENVIRONMENT_FALLBACK (relativeTime without now) | none |
| Q1-share-copied-1280.png | `/tools/midjourney` | pageerror: React #418 hydration mismatch (HTML) | none |
| Q1-share-copied-375.png | `/tools/midjourney` | pageerror: React #418 hydration mismatch (HTML) | none |
| Q1-share-open-1280-bg.png | `/bg/tools/midjourney` | none | aria-allowed-attr (critical, 1) |
| Q1-share-open-1280.png | `/tools/midjourney` | none | aria-allowed-attr (critical, 1) |
| Q1-share-open-375-bg.png | `/bg/tools/midjourney` | pageerror: React #418 hydration mismatch (HTML) | aria-allowed-attr (critical, 1) |
| Q1-share-open-375.png | `/tools/midjourney` | none | aria-allowed-attr (critical, 1) |
| Q1-sign-in-error-1280.png | `/sign-in` | http.400: POST (auth emulator) signInWithPassword; console.error: Failed to load resource: 400 | none |
| Q1-sign-in-error-375.png | `/sign-in` | http.400: POST (auth emulator) signInWithPassword; console.error: Failed to load resource: 400 | none |
| Q1-tool-jasper-1280.png | `/tools/jasper` | none | aria-allowed-attr (critical, 1) |
| Q1-tool-jasper-375.png | `/tools/jasper` | none | aria-allowed-attr (critical, 1) |
| Q1-tool-midjourney-1280-bg.png | `/bg/tools/midjourney` | none | aria-allowed-attr (critical, 1) |
| Q1-tool-midjourney-1280.png | `/tools/midjourney` | none | aria-allowed-attr (critical, 1) |
| Q1-tool-midjourney-375-bg.png | `/bg/tools/midjourney` | none | aria-allowed-attr (critical, 1) |
| Q1-tool-midjourney-375.png | `/tools/midjourney` | pageerror: React #418 hydration mismatch (HTML) | aria-allowed-attr (critical, 1) |
| Q1-tutorial-playing-1280.png | `/tools/midjourney` | console.warning: Allow attribute will take precedence over 'allowfullscreen'.; console.warning: No available adapters. | none |
| Q1-tutorial-playing-375.png | `/tools/midjourney` | console.warning: Allow attribute will take precedence over 'allowfullscreen'.; console.warning: No available adapters. | none |
| Q1-user-menu-1280-bg.png | `/bg` | none | aria-hidden-focus (serious, 1) |
| Q1-user-menu-1280.png | `/` | none | aria-hidden-focus (serious, 1) |
| Q1-user-menu-375-bg.png | `/bg` | none | aria-hidden-focus (serious, 1) |
| Q1-user-menu-375.png | `/` | none | aria-hidden-focus (serious, 1) |
| Q1-tool-loading-1280.png | `/tools/midjourney` | not recorded (throttled-network capture) | not run |
| Q1-tool-loading-375.png | `/tools/midjourney` | not recorded (throttled-network capture) | not run |

---

## Top 10 to fix tonight

1. **B1 hydration #418** on tool and bundle-detail pages: pass `serverState` (the pristine state) to `<Provider>` in
   `api/StoreProvider.tsx`, or gate `useCurrentUser` behind `useHydrated`. Re-check `/tools/*` and `/bundles/*` in a fresh
   context. (`api` / `features/auth`)
2. **B2 `aria-pressed` on the visitor save link:** drop the attribute in the signed-out branch. This unblocks INV-25 on
   library and tool. (`features/my-library`)
3. **M7 relativeTime without `now`:** use `useNow()` in `NotificationItem`. This removes every remaining console error.
   (`features/notifications`)
4. **M1 white default 404:** add the `[locale]/[...rest]` catch-all with `notFound()` and a root `not-found.tsx` with `lang`.
   (`app` routes, `features/system`)
5. **M8 text-subtle contrast:** lift the token to about `oklch(0.66 0.014 265)`. This clears every color-contrast failure in
   menus and notifications. (`packages/ui`)
6. **M3 card footer:** one line, with the trial pill moved out of the footer, so price and rating rows align (ruling 4).
   (`features/catalogue`)
7. **M5 collection header at 375:** stack the actions so the title is legible; broken in bg. (`features/my-library`)
8. **M4 bg Notify-me CTA overflow at 375:** let the button wrap or shorten the copy. (`features/bundle-interest`,
   `messages/bg`)
9. **M6 compare table at 375:** stacked label/value layout so both tools are visible. (`features/compare`)
10. **M2 tags on the tool page** and **M9 "Contact sales" dead click**, both in `features/tool`.

Next in line: M13 mobile filter disclosure, then the admin gaps M10–M12.
