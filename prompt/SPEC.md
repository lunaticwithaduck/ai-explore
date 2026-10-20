# AI Explore — specification

A public library of AI tools, modelled on the Steam / Epic Games library: browse a
catalogue, open a page per tool (pricing, tutorials, updates, reviews), compare tools,
save them into a personal library, and buy curated bundles of tools.

The Figma Make prototype in `reference/figma-make/` is the visual and behavioural
reference. Its data is mock data and its code is not to be copied wholesale; its layout,
dark theme, and the design rulings in §9 are binding.

Scope markers: **[MVP]** ships in the overnight run. **[LATER]** must not be built early,
but the data model must not preclude it.

Architecture in one line: Next.js on Firebase App Hosting, Firebase Auth + Firestore,
**no Cloud Functions**. Security rules are the backend.

---

## 1. Actors

| Actor | Can |
|---|---|
| Visitor | Browse, search, filter, read tool and bundle pages, compare, share. |
| User | Everything a visitor can, plus save tools, collections, reviews, helpful votes, notifications, profile, settings, bundle interest. |
| Admin | A user with a document at `admins/{uid}`. Curates the catalogue in `/admin`. Admins are created by hand (console or seed script), never from the app. |

---

## 2. Firestore model

`Localized` is `{ en: string; bg?: string }`. Rendering falls back to `en` when `bg` is
missing. Money is **integer minor units** (cents, USD) everywhere; never a float.

### 2.1 Public catalogue [MVP]

Read: anyone (published only). Write: admin, except the rating aggregate (§2.3).

**`categories/{categoryId}`**: `name: Localized · icon (lucide name) · order`

Seed categories: image, text, video, audio, code, analytics.

**`tools/{slug}`**

| Field | Notes |
|---|---|
| `slug`, `name`, `developer`, `websiteUrl` | slug is the doc id and the URL segment |
| `tagline`, `description` | `Localized` |
| `categoryId`, `tags[]` | tags are lowercase kebab |
| `logo` | `{ path, background }`. `background` is `#RRGGBB`, validated. Chosen per tool so the original-colour logo contrasts (§9) |
| `pricing` | `{ hasFreePlan, trialDays?, fromPriceCents? }`. `fromPriceCents` = cheapest paid plan, monthly-normalised |
| `plans[]` | `{ name, priceCents \| null, period: 'month' \| 'year' \| 'custom', features: Localized[], popular? }` |
| `features[]` | `Localized[]` |
| `tutorials[]` | `{ youtubeId, title: Localized, durationMin, difficulty: 'beginner' \| 'intermediate' \| 'advanced' }`, ≥ 4 per tool. Every `youtubeId` is checked against YouTube oEmbed before it enters the seed |
| `comparison` | `{ apiAccess: 'none' \| 'limited' \| 'full', integrations: int, speed: 1–5, outputQuality: 1–5, bestUseCase: Localized }` |
| `similarToolIds[]`, `complementaryToolIds[]` | references to other tool slugs |
| `rating` | `{ count: int, sum: int }`: the aggregate, §2.3 |
| `published`, `createdAt`, `updatedAt`, `lastReleaseAt` | |

**`tools/{slug}/updates/{updateId}`**: `toolId · version · kind: 'feature' | 'improvement' | 'bugfix' · title: Localized · changes: Localized[] · publishedAt`.
Queried as a collection group for notifications (§5).

**`bundles/{slug}`**: `name · description: Localized · toolIds[] · icon · accent (token name) · pricing: { monthly, quarterly, yearly } each { priceCents } · published`

Seed bundles: Startup Founder Pack, AI Video Creator Stack, Solo Agency Stack,
AI SDR Bundle, Legal Research Stack, Content Creator Suite, Developer Productivity Kit.

**`config/app`**: feature flags. `checkoutEnabled: false` in the MVP.

**`admins/{uid}`**: existence = admin. A user may read only their own; no client writes.

### 2.2 User data [MVP]

Owner-only read and write unless noted.

- **`users/{uid}`**: `displayName · photoUrl · locale: 'en' | 'bg' · prefs: { productUpdates: bool, emailDigest: bool } · notificationsSeenAt · createdAt`
- **`users/{uid}/saved/{toolSlug}`**: `savedAt`
- **`users/{uid}/collections/{collectionId}`**: `name (1–40) · icon (allow-listed lucide name) · color (token name) · toolIds[] (≤ 50) · order · createdAt`
- **`users/{uid}/bundleInterest/{bundleSlug}`**: `period · createdAt`. Admins may read all, as a collection group.
- **`users/{uid}/subscriptions/{id}`** [LATER writer]: owner may read; **no client may write**. Reserved for the future payment integration.

### 2.3 Reviews [MVP]

- **`tools/{slug}/reviews/{uid}`**: doc id = author uid, so one review per user per tool.
  `toolId · authorUid (= doc id) · rating (int 1–5) · body (≤ 2000) · authorName · authorPhotoUrl · locale · helpfulCount · createdAt · updatedAt`.
  `authorUid` exists so profile and account deletion can find a user's reviews with a
  collection-group query.
- **`tools/{slug}/reviews/{uid}/votes/{voterUid}`**: `createdAt`. One helpful vote per voter per review.

With no server, the client keeps the aggregates. Every review write is a **batched write**
that also updates `tools/{slug}.rating` with `increment()`. Every vote write also updates
`helpfulCount`. Security rules verify the pairing with `getAfter()` / `existsAfter()`, so
an unpaired or miscounted write is rejected (invariants 5–9).

---

## 3. Routes [MVP]

Next.js App Router under `app/src/app/[locale]/`. Locales `en` (default) and `bg`.

| Route | Rendering | Content |
|---|---|---|
| `/` | server + client filter | Library: hero search, category chips, sort, tag filters, tool grid, Bundles section |
| `/tools/[slug]` | server (ISR) | Tool page: header, Open, tags, plans, tutorials, updates, reviews, compare, similar + complementary, share |
| `/bundles` and `/bundles/[slug]` | server (ISR) | Bundle list and detail: tools, period toggle, savings, Subscribe (flagged) |
| `/compare?a=&b=` | server + client | Side-by-side table (§6) |
| `/library` | client, auth | My library: saved tools and collections (the Steam "library" view) |
| `/profile`, `/settings` | client, auth | §7 |
| `/sign-in`, `/sign-up`, `/reset-password` | client | Firebase Auth: email + password, Google |
| `/admin/**` | client, admin | §8 |

Public pages read Firestore on the server with the **client SDK, unauthenticated**, so
rules apply on the server too. Rules are not filters: every public list query carries
`where('published', '==', true)`, or the rules reject it. Nothing uses the Admin SDK at runtime. SEO: per-page
metadata, `hreflang` alternates, `sitemap.xml`, JSON-LD `SoftwareApplication` with
`aggregateRating` on tool pages.

---

## 4. Library and search [MVP]

- The catalogue is small (hundreds of tools at most). The server reads every published
  tool's summary fields once per revalidation; search, filtering and sorting run on the
  client against that list. There is no search service (it would need Functions).
- Filter state lives in the URL (`?q=&category=&tags=&sort=&price=`) so views are shareable.
- Sort: rating, review count, price low→high, price high→low, newest release.
- Price filter: free plan, has trial, paid only.
- Search matches name, tagline, tags and developer, in either locale.

---

## 5. Notifications [MVP]

Without Functions there is no fan-out. Notifications are **derived** from the
`updates` collection group, for tools the user has saved, over the last 30 days (`in`
queries chunked by 30). An update is **New** when `publishedAt > notificationsSeenAt`.
Opening the dropdown and choosing "Mark all as read" sets `notificationsSeenAt` to
server time.

---

## 6. Compare [MVP]

Columns are two tools. Rows: pricing (from price, free plan, trial), features, API
access, integrations, speed, output quality, best use case. The second tool is chosen
with a searchable picker, defaulting to the first similar tool.

---

## 7. Profile and settings [MVP]

- **Profile:** avatar, name, member since, counts (saved, collections, reviews), recent reviews, collections.
- **Settings:** display name, locale (persists and redirects), notification prefs
  (stored; email delivery is [LATER] and shown as such), sign out, delete account. Delete
  removes the user's own documents client-side, and their reviews with the matching
  aggregate decrements, then deletes the auth user.

---

## 8. Admin [MVP]

`/admin` lists tools, bundles and updates, with create, edit and publish toggles, all
validated by the same zod schemas as the seed. A logo is a path under
`app/public/logos/`. Storage uploads are [LATER]. Admin sees bundle-interest counts per
bundle and period. A non-admin gets a 403 view; the rules are the real guard.

---

## 9. Design rulings (from the prototype review)

These came out of the prototype iterations and are binding:

1. Dark theme. Light theme is [LATER]; tokens must not preclude it.
2. Tools show their **real logo in its original colours**, not an icon, on a per-tool
   background chosen for contrast (`logo.background`).
3. The logo box is the **same fixed size on every card**; logos are contained, not cropped.
4. On a card, **price and rating are pinned to the bottom** whatever the description
   length; cards in a row are equal height; cards are compact.
5. Version labels show the bare number: `2.1.0`, not `v2.1.0` or `Version 2.1.0`.
6. The notifications badge says **New**, not Unread.
7. Profile and Settings share one Back button component, top-left.
8. Search input: high-contrast typed text, a placeholder, and no heavy focus stroke. Focus
   stays visible through the subtle focus-ring token, for accessibility.
9. Tutorials are a horizontal carousel of at least 4 real videos per tool. Embeds are
   click-to-load (`youtube-nocookie`), showing a thumbnail first.
10. Share: copy link (with a fallback when the Clipboard API is blocked), Web Share API
    where available, X, Facebook, LinkedIn, email. Every share button has the same height
    in every state.
11. Tool page ends with a horizontal "Similar tools" carousel and a "Works well with"
    (complementary workflow) section.

---

## 10. Bundles and payments

- [MVP] Bundle pages show monthly, quarterly and yearly prices. List price =
  Σ(tools' `fromPriceCents`) × months in the period. Savings % =
  `round((list − price) / list × 100)`. Both are computed in exactly one module.
- [MVP] With `checkoutEnabled` false, Subscribe is replaced by **Notify me**, which writes
  `bundleInterest` (idempotent).
- [LATER] Checkout through a payment provider writing `users/{uid}/subscriptions`. The
  provider is not chosen; it will need a trusted writer (Functions or a provider-hosted
  integration), so the rules already deny client writes there.

---

## 11. [LATER]

Light theme · Storage logo uploads · tool submissions by users · email digests · payment
checkout · full-text search service · more catalogue content (facts need human verification).

---

## Invariants

These are the acceptance tests. Each is written before its implementation.

**Security rules** (`@firebase/rules-unit-testing` against the Firestore emulator):

1. A visitor reads published tools, categories, bundles, updates, reviews and `config/app`;
   reading an unpublished tool or bundle is denied.
2. A non-admin cannot create, delete or edit catalogue documents except through the rating
   aggregate path (5–7). A user with `admins/{uid}` can.
3. A user reads and writes only their own `users/{uid}` tree. Any access to another user's
   tree is denied.
4. No client can write `admins/*` or `users/*/subscriptions/*`, not even the owner or an admin.
5. Creating a review: the doc id equals `request.auth.uid`, the rating is an int from 1 to 5,
   and the body is at most 2000 characters. The same batch must raise `rating.count` by exactly
   1 and `rating.sum` by exactly the rating. A review without the aggregate change is
   denied. An aggregate change without the review is denied.
6. Editing one's own rating from r1 to r2 changes `sum` by r2 − r1 and leaves `count` alone.
   Deleting changes `count` by −1 and `sum` by −r.
7. Two users create and delete reviews in interleaved order (several rounds, including concurrent
   `increment()` batches). Afterwards `rating.sum` equals the sum of the remaining ratings and
   `count` equals the number of remaining reviews.
8. A user cannot write another user's review or create a second review on the same tool.
9. Helpful vote: the doc id equals the voter uid, a voter cannot vote on their own review,
   `helpfulCount` changes by exactly ±1 in the same batch, and a second vote is denied.
10. Every user-writable document rejects unknown fields (`keys().hasOnly`) and
    out-of-range values (collection name 1–40, at most 50 `toolIds`, allow-listed icon and
    colour, locale ∈ {en, bg}, period ∈ {monthly, quarterly, yearly}).
11. `notificationsSeenAt` can only be written as `request.time`.
12. `bundleInterest` is owner-write, and admins read it as a collection group. Non-admins
    cannot run the collection-group read.

**Logic** (Vitest):

13. Bundle pricing, table-driven: list price, savings %, rounding, a tool without a paid plan
    (contributes 0), and an empty bundle (no division by zero).
14. Seed integrity: every seed document parses with its zod schema. Every `similarToolIds`,
    `complementaryToolIds` and bundle `toolIds` entry resolves. Each tool's `fromPriceCents`
    equals its cheapest paid plan, monthly-normalised. Each tool has at least 4 tutorials.
15. i18n: the `en` and `bg` message catalogues have identical key sets, and no message is
    empty. `Localized` falls back to `en`.
16. Rating display: `sum / count` to 1 decimal; 0 reviews renders the "No reviews yet"
    message, never `NaN` or `0.0`.
17. Version label renders the bare version string (ruling 5).
18. Share copy: when `navigator.clipboard.writeText` rejects, the fallback runs, the UI
    reports success, and nothing is thrown.

**End to end** (Playwright against the emulators and a production build, at 375 px and 1280 px):

19. Visitor: library → search "mid" → category filter → open tool → scroll tutorials →
    compare with another tool → copy share link.
20. User: sign up → save a tool → create a collection → add the tool → filter library by
    the collection → write a review → the average updates on the tool page and its card →
    edit the review → delete it.
21. Notifications: a seeded update for a saved tool shows as New. "Mark all as read" clears
    the badge, and the badge stays cleared after a reload.
22. Bundle: open → switch month / quarter / year → prices and savings change → Subscribe
    absent (flag off) → Notify me registers interest → a second click changes nothing.
23. Locale: switch to BG → URL becomes `/bg/...` → chrome is Bulgarian → the preference
    survives sign-out and sign-in.
24. Admin: an admin creates and publishes a tool, and it appears in the library. A non-admin
    on `/admin` sees the 403 view.
25. Accessibility: axe reports no serious or critical violations on library, tool, bundle,
    compare and settings pages.
26. Card layout (rulings 3 and 4): in a library row, cards have equal height, logo boxes have
    identical size, and price rows share one bottom edge (bounding-box assertions).
