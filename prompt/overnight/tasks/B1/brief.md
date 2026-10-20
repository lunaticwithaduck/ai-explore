**Template:** brief-v1 · **Task:** B1 · **Phase:** 4 · **Model:** sonnet · **Base sha:** 4fb6e23

# B1 — Library view, ToolCard, and filters

Read `~/Repos/ai-explore/prompt/overnight/templates/feature-common.md` first. It is binding.

## Scope
`app/src/features/library/**`, `app/src/messages/{en,bg}/library.json`, `artifacts/screens/B1-*`.
Stubs you replace: `features/library/browse/LibraryView.tsx` (props `{ tools, categories, bundles }`) and the
`features/catalogue/components/ToolCard/ToolCard.tsx` (props `{ tool, categoryName?, actions? }`; pass `actions={<SaveToolButton toolId=… />}`).

## Owns
INV-26 (card layout). INV-19's search and filter steps (`app/e2e/inv-19-visitor.spec.ts`) must work too,
but E4 un-fixmes INV-19.

## Goal

### Hero
- Keep an `h1` with `common.appName` and a `Text` with `common.tagline`. Smoke and INV-23 read them; the
  `common` namespace is read-only for you.
- Add a `library.searchInput` SearchInput.

### Filters (SPEC §4)
- State lives in the URL (`?q=&category=&tags=&sort=&price=`). Read it with `useSearchParams`; write it with
  `useRouter().replace` from `@/i18n/navigation`, scroll false.
- **Search** matches name, both-locale tagline, tags and developer, case-insensitive.
- **Category chips** sit inside `library.categoryFilter`: an "All" chip plus one per category with `data-id`.
- **Tag chips** (`library.tagFilter`): `Tag` with `aria-pressed`.
- **Price filter** (`library.priceFilter`): all, free plan, has trial, paid only.
- **Sort** (`library.sortSelect`): rating (default), reviews, price low→high, price high→low, newest
  (`lastReleaseAt`). Free tools sort as 0.
- Put the filtering and sorting logic in `features/library/utils/` and unit-test it table-driven.

### Grid (`library.grid`)
Cards render in a responsive grid: 1 column at 375 px, 2 at `sm`, 3–4 at `lg`.

### ToolCard (rulings 2–4)
- The root carries `library.toolCard` and `data-id=<slug>`.
- **Logo:** `ToolLogo` in a fixed-size `library.cardLogo` box.
- **Text:** name, category, and a 2-line clamped tagline.
- **Bottom row** (`library.cardPriceRow`), pinned to the card bottom whatever the content: price
  ("Free", "From $X/mo", a trial badge) and `library.cardRating` (average to 1 decimal via `formatAverage`
  plus the count, or "No reviews yet").
- Cards in a row are equal height, and the card stays compact.
- **Linking:** the card links to `routes.tool(slug)`. Nest no interactive element inside the link.
  Render `SaveToolButton` (slot from `@/features/my-library/components/SaveToolButton/SaveToolButton`,
  a stub until U1) as a sibling overlay.

### Empty state and bundles
- With no matches, show `library.empty` with a reset-filters action.
- Below the grid, render `BundlesSection` (slot from `@/features/bundles/components/BundlesSection/BundlesSection`, B2) with `{ bundles, tools }`.

## Acceptance
- [ ] INV-26 is un-fixme'd and green on both projects.
- [ ] The filter and sort utils have table-driven unit tests.
- [ ] `scripts/gate.sh --full --task B1 --base 4fb6e23 --expect-pending 1-12,18-25` → `GATE PASS`.
- [ ] Screenshots: library at 375 and 1280, plus a search with no results.
